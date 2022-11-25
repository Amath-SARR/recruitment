import { User } from "src/app/admin/user/user";
import { BaseClass } from "src/app/shared/classes/base-class";

export class Collaborateur extends BaseClass {
  entreprise_id: number | undefined;
  user: User | undefined;
  created_at: Date|undefined;
}
