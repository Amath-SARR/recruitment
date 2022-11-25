import { BamboHttpService } from "./bambo-http.service";
import { BaseClass } from '../classes/base-class';

export abstract class BaseService<T extends BaseClass> {

  prefix = '';

  constructor(public http: BamboHttpService) { }

  /**
   * @author Moussa FOFANA
   * @since 23.01.22
   * @description Récupére la liste de tous les enregistrements
   * @returns Promise
   */
  findAll() {
    return this.http.get(this.prefix);
  }

  /**
   * @author Moussa FOFANA
   * @since 23.01.22
   * @description Récupére un enregistrement à partir de son id
   * @param id
   * @returns Promise
   */
  findOneById(id: number) {
    return this.http.get(this.prefix + '/' + id);
  }

  /**
   * @author Moussa FOFANA
   * @since 23.01.22
   * @description Enregistt
   * @returns Promise
   * @param object
   */
  save(object: T) {
    return this.http.post(this.prefix, object);
  }

  /**
   * @author Moussa FOFANA
   * @since 23.01.22
   * @description Met à jour un enregistrement donnée
   * @param object
   * @returns Promise
   */
  update(object: T) {
    return this.http.put(`${this.prefix}/${object.id}`, object);
  }
  /**
   * @author Moussa FOFANA
   * @since 23.01.22
   * @description Supprime un objet donné
   * @param object
   * @returns Promise
   */
  removeObject(object: T) {
    return this.http.delete(`${this.prefix}/${object.id}`);
  }

  /**
   * @author Moussa FOFANA
   * @since 23.01.22
   * @description Supprime un objet à partir de son id
   * @param id
   * @returns Promise
   */
  removeById(id: number) {
    return this.http.delete(`${this.prefix}/${id}`);
  }

  /**
   * @author Moussa FOFANA
   * @since 23.01.22
   * @description Pagine des enregistrements avec le nombre d'élement par page et
   * la prochaine page à charger si définie
   * @param itemsPerPage
   * @param pageNumber
   * @returns Promise
   */
  paginate(itemsPerPage: number, pageNumber = null) {
    if (pageNumber) {
      return this.http.get(`${this.prefix}/paginate/${itemsPerPage}?page=${pageNumber}`);
    }
    return this.http.get(`${this.prefix}/paginate/${itemsPerPage}`);
  }
}
