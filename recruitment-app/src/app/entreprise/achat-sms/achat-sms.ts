import { User } from "src/app/admin/user/user";
import { Entreprise } from "src/app/default/entreprise/entreprise";

export class AchatSms {
  id: number | undefined;
  uid: string| undefined;
  user_id: number | undefined;
  sms_pack_id: number | undefined;
  entreprise_id: number | undefined;
  montant: number | undefined ;
  nombre_sms: number|undefined;
  client_phone : string |undefined;
  ref_command: string |undefined;
  entreprise: Entreprise | undefined;
  user: User | undefined;
  currency: string |undefined;
  env: string |undefined;
  type_event: string |undefined;
  payment_method: string |undefined;

}
