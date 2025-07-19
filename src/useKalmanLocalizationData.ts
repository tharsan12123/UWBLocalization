// src/useKalmanLocalizationData.ts
import { useEffect, useState } from 'react';
import { db } from './firebase';
import { ref, onValue } from 'firebase/database';

export interface KalmanLocalizationData {
  tag_tdoa: [number, number];
  tag_kalman: [number, number];
  anchors: {
    A1: [number, number];
    A2: [number, number];
    A3: [number, number];
  };
  accuracy: number;
}

export default function useKalmanLocalizationData() {
  const [data, setData] = useState<KalmanLocalizationData | null>(null);

  useEffect(() => {
    const dbRef = ref(db, '/kalman');

    const unsubscribe = onValue(dbRef, (snapshot) => {
      const raw = snapshot.val();

      const parsePair = (input: any): [number, number] => {
        if (!input) return [0, 0];
        const x = parseFloat(input[0] ?? input["0"]) || 0;
        const y = parseFloat(input[1] ?? input["1"]) || 0;
        return [x, y];
      };

      const result: KalmanLocalizationData = {
        tag_tdoa: parsePair(raw?.tag_tdoa),
        tag_kalman: parsePair(raw?.tag_kalman),
        anchors: {
          A1: parsePair(raw?.anchors?.A1),
          A2: parsePair(raw?.anchors?.A2),
          A3: parsePair(raw?.anchors?.A3),
        },
        accuracy: parseFloat(raw?.accuracy) || 0,
      };

      setData(result);
    });

    return () => unsubscribe();
  }, []);

  return data;
}
