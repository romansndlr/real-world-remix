import * as faker from "faker";
import { Factory } from "rosie";

export default Factory.define("Article").attrs({
  title: () => faker.lorem.text(),
  description: () => faker.lorem.sentence(),
  body: () => faker.lorem.paragraph(),
});
