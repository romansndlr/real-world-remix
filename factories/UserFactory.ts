import * as faker from "faker";
import { Factory } from "rosie";

export default Factory.define("User").attrs({
  email: () => faker.internet.email(),
  password: () => faker.internet.password(),
  username: () => faker.internet.userName(),
  bio: () => faker.lorem.paragraph(),
});
