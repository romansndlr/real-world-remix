import * as faker from "faker";
import { Factory } from "rosie";

export default Factory.define("Comment").attrs({
  body: () => faker.lorem.sentence(),
});
