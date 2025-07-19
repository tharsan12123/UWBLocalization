import { useEffect, useState } from 'react';
import { db } from './firebase';
import { ref, onValue } from 'firebase/database';

interface LocalizationData {
  tag: [number, number];
  tdoa: {
    tdoa12: number;
    tdoa13: number;
    tdoa23: number;
  };
  anchors: {
    A1: [number, number];
    A2: [number, number];
    A3: [number, number];
  };
  accuracy: number;
}

export default function useLocalizationData() {
  const [data, setData] = useState<LocalizationData | null>(null);

  useEffect(() => {
    const dbRef = ref(db, '/localization');

    const unsubscribe = onValue(dbRef, (snapshot) => {
      const raw = snapshot.val();
      console.log("🔥 Firebase raw data:", raw);

      // Parses either [x, y] or {0: x, 1: y}
      const parsePair = (input: any): [number, number] => {
        if (!input) return [0, 0];
        const x = parseFloat(input[0] ?? input["0"]) || 0;
        const y = parseFloat(input[1] ?? input["1"]) || 0;
        return [x, y];
      };

      const result: LocalizationData = {
        tag: parsePair(raw?.tag),
        tdoa: {
          tdoa12: parseFloat(raw?.tdoa?.A1_A2) || 0,
          tdoa13: parseFloat(raw?.tdoa?.A1_A3) || 0,
          tdoa23: parseFloat(raw?.tdoa?.A2_A3) || 0,
        },
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
