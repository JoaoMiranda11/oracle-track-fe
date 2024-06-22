import { useEffect, useState } from "react";

export function CountDown({
  dueDate,
  onExpire,
}: {
  dueDate: Date;
  onExpire?: () => void;
}) {
  const [time, setTime] = useState(0);
  const [started, setStart] = useState(false);
  const msInterval = 1000;

  useEffect(() => {
    const time = dueDate.getTime() ?? 0;
    const totalTime = (time - Date.now()) / 1000;
    setTime(totalTime < 0 ? 0 : totalTime);
    setStart(true);
  }, [dueDate]);

  useEffect(() => {
    setTimeout(() => {
      if (time > 0) {
        const newTime = time - msInterval / 1000;
        setTime(Math.abs(newTime > 0 ? newTime : 0));
      } else {
        onExpire?.();
      }
    }, msInterval);
  }, [time]);

  if (!started) {
    return <></>;
  }

  const min = (0 + Math.abs(time / 60).toFixed(0)).slice(-2);
  const sec = (0 + Math.abs(time % 60).toFixed(0)).slice(-2);
  return (
    <div>
      {min}:{sec}
    </div>
  );
}
