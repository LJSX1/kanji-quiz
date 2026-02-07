import { grade3 } from "./grade3";
import { grade4 } from "./grade4";
import { KanjiEntry, Grade } from "@/lib/types";

export { grade3, grade4 };

export function getKanjiByGrade(grade: Grade): KanjiEntry[] {
  switch (grade) {
    case 3:
      return grade3;
    case 4:
      return grade4;
    case "both":
      return [...grade3, ...grade4];
  }
}
