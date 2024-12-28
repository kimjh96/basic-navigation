export default function styleStringToObject(styleString: string): Record<string, string> {
  return styleString.split(";").reduce(
    (styleObject, styleProperty) => {
      const [property, value] = styleProperty.split(":").map((item) => item.trim());
      if (property) {
        styleObject[property] = value;
      }
      return styleObject;
    },
    {} as Record<string, string>
  );
}
