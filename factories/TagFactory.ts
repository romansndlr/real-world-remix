import * as faker from "faker";
import { Factory } from "rosie";

export default Factory.define("Tag").attrs({
  name: () => faker.lorem.words(),
});
