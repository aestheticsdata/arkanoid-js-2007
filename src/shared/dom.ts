export function getElementByIdOrThrow<T extends HTMLElement>(id: string): T {
  const element = document.getElementById(id);
  if (!(element instanceof HTMLElement)) {
    throw new Error(`Missing required HTMLElement with id "${id}"`);
  }
  return element as T;
}
