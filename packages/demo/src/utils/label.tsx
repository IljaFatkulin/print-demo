import label1 from "./../zpl/label1.hbs?raw";
import Handlebars from "handlebars";
import { format } from "date-fns";

Handlebars.registerHelper("splitNewLines", (text) => {
  return text.split("\n").join("\\&");
});

Handlebars.registerHelper("formatDate", (date) => {
  return format(date, "dd / MM / yyyy");
});

export function getLabel1(labelData: {
  title?: string;
  price?: number;
  barcode?: string;
  brand?: string;
  color?: string;
  date: string;
}) {
  const template = Handlebars.compile(label1);
  return template(labelData);
}
