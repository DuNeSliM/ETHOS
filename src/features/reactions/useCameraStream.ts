import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Shared plumbing for every place that shows the participant's real camera.
 *
 * Strictly display-only, and that is enforced by what this file does *not*
 * contain: no canvas, no `drawImage`, no `toDataURL`, no `getImageData`, no
 * `MediaRecorder`, no upload. The stream is handed to `<video>` elements and
 * nothing else ever reads it.
 *
 * Every track is stopped when the consumer unmounts or calls `stop`, so the
 * browser's own camera indicator goes out at the same moment the UI says the
 * camera is off.
 *
 * The reaction estimates elsewhere in the app stay scripted values in
 * `mockEngine.ts`. Turning this preview on does not change a single one of
 * them - it only lets a participant see what a camera *would* be looking at.
 */

export type CameraStatus = 'off' | 'starting' | 'live' | 'error';

/**
 * One wording for every failure. We deliberately do not surface the raw
 * `DOMException`: denial, no device and device-in-use all mean the same thing
 * to a test participant, and the browser's own message is not in our voice.
 */
const CAMERA_ERROR =
  'Die Kamera konnte nicht gestartet werden. Möglicherweise hast du den Zugriff abgelehnt, oder es ist keine Kamera vorhanden. Der Prototyp funktioniert auch ohne Bild vollständig.';

const NO_API_ERROR = 'Dieser Browser stellt keine Kamera-Vorschau bereit.';

export function useCameraStream() {
  /**
   * One stream can feed several `<video>` elements at once - the corner
   * self-view and the enlarged one inside its sheet show the same picture.
   * They are tracked as a set so that stopping the camera blanks *all* of
   * them; a frozen last frame under a UI that says "off" would be exactly the
   * kind of mismatch this prototype promises not to produce.
   */
  const videosRef = useRef(new Set<HTMLVideoElement>());
  const streamRef = useRef<MediaStream | null>(null);
  const [status, setStatus] = useState<CameraStatus>('off');
  const [error, setError] = useState<string | null>(null);

  /**
   * Callback ref rather than a plain one: a `<video>` is usually mounted only
   * once the stream already exists, so an effect keyed on a ref object would
   * never fire. React hands us `null` on unmount without saying which node it
   * means, so detached elements are swept here instead.
   */
  const attachVideo = useCallback((node: HTMLVideoElement | null) => {
    videosRef.current.forEach((video) => {
      if (!video.isConnected) videosRef.current.delete(video);
    });
    if (!node) return;
    videosRef.current.add(node);
    node.srcObject = streamRef.current;
  }, []);

  const stop = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    videosRef.current.forEach((video) => {
      video.srcObject = null;
    });
    setStatus('off');
  }, []);

  const start = useCallback(async () => {
    setError(null);

    if (!navigator.mediaDevices?.getUserMedia) {
      setError(NO_API_ERROR);
      setStatus('error');
      return;
    }

    setStatus('starting');

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
        audio: false,
      });
      streamRef.current = stream;
      videosRef.current.forEach((video) => {
        video.srcObject = stream;
      });
      setStatus('live');
    } catch {
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
      setError(CAMERA_ERROR);
      setStatus('error');
    }
  }, []);

  // Release the camera if the consumer disappears for any reason.
  useEffect(() => {
    const videos = videosRef.current;
    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
      videos.clear();
    };
  }, []);

  return { attachVideo, status, error, start, stop, isLive: status === 'live' };
}
