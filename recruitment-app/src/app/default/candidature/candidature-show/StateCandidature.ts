import { State } from "src/app/admin/states/state";
import { User } from "src/app/admin/user/user";
import { Candidature } from "../candidature";

export class StateCandidature {
  id: number|undefined;
  user: User | undefined;
  candidature: Candidature | undefined;
  state: State|undefined;
  nomState: string|undefined;
  typeState: string|undefined;
  created_at: string | undefined;
  updated_at: string | undefined;
}
