/**
 * @author Mariama Fatou Sarr DIOP
 * @since 26.01.2022
 * @link https://recrutore.atlassian.net/browse/RAD-86
 */
export class State {
  id: number | undefined;
  nom: string | undefined;
  type: string | undefined;
  description: string | undefined;
  ordre: number = 0;
  code: string | undefined;
  candidatures_count_by_campagne: {
    [key: number]: number | undefined;
  } | undefined;
}
