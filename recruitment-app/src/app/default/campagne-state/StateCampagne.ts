import { BaseClass } from "src/app/shared/classes/base-class";
import { State } from '../../admin/states/state';

export class StateCampagne implements BaseClass {
  id: number | undefined;
  campagne_id: number | undefined;
  nomState : string|undefined;
  state_id: number | undefined;
  state: State | undefined;
  created_at = '';
}
