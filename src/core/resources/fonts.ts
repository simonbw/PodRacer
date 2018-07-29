import FontFaceObserver from "fontfaceobserver";

export const HEADING_FONT = "Righteous";
export const MAIN_FONT = "Raleway";

export function waitForFontsLoaded() {
  return Promise.all(
    [HEADING_FONT, MAIN_FONT].map(font => new FontFaceObserver(font).load())
  );
}
