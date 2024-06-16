import { dashBoardRoute } from "@/app.routes";

export function removePath(fullPath: string, route: string): string {
  const escapedMatch = route.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern: RegExp = new RegExp(`\\/${escapedMatch}.*`);
  const result: RegExpExecArray | null = pattern.exec(fullPath);
  if (result) {
    const resultado: string = fullPath.substring(
      0,
      result.index + route.length + 1
    );
    return resultado;
  } else {
    return dashBoardRoute.href;
  }
}
