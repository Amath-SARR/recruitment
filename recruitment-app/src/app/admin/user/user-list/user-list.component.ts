import { filter, first, Subscription } from 'rxjs';
import { User } from './../user';
import { AuthService } from './../../../shared/services/auth.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from '../user.service';
import { PromiseError } from '../../../shared/classes/promise-error';
import { NzModalService, NzModalRef } from 'ng-zorro-antd/modal';
import { FileService } from '../../../shared/services/file.service';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { UserMessage } from '../user-message';
import { FilterModel } from './filterModel';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
/**
 * @author Moussa FOFANA
 * @since 22.01.22
 * @copyright bamboguirassy
 * @link
 */
export class UserListComponent implements OnInit, OnDestroy {

  users: User[] = [];
  userModel = new User();
  isUserCreating = false;
  userUpdate = new User();
  modalVisible = false;
  formVisible = false;
  currentUser: User;
  paginationData: any = {};
  itemsPerPage = 9;
  pageSizeOptions = [9, 36, 72, 96];
  searchField = null;
  filterFields = ['admin', 'actif', 'collaborateurs', 'profession', 'telephone'];
  filterUserTypes = [{'name':'admin'},{'name':'collaborateur'}];
  filterComptes = [{'name':'compte actif', 'value':true},{'name':'compte inactif', 'value':false}];
  testFilter = {type: '', enabled: '', firstDate: '', secondDate: ''}
  dateRange: Date[] = [];
  firstDate: Date | undefined;
  secondDate: Date | undefined;
  user: any
  errors: any = {};
  nzTitle: string | undefined
  subscriptions: Subscription[] = [];
  filterObj: FilterModel;

  public Editor = ClassicEditor;
  userMessage = new UserMessage();
  isContactUserForm = false;
  isUserMessageSending = false;
  confirmModal?: NzModalRef;
  isShowSelect = true;
  allChecked = false;
  indeterminate = true;

  constructor(public userSrv: UserService, private modal: NzModalService, public authSrv: AuthService, public fileSrv: FileService) {
    this.userModel = new User();
    this.userUpdate = new User();
    this.currentUser = Object.create(null);
    this.filterObj = new FilterModel()
  }

  ngOnInit(): void {
    this.paginate();
    let subscription = this.authSrv.currentUserProvider
      .subscribe((user: User) => this.currentUser = user);
    if (!this.subscriptions.includes(subscription)) {
      this.subscriptions.push(subscription);
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  save() {
    this.isUserCreating = true;
    this.userSrv.createAdmin(this.userModel)
      .then((data: User) => {
        this.users = [data, ...this.users];
        this.userModel = new User();
      }).catch((err: PromiseError) => {
        if (err.validationError) {
          this.errors = err.data;
        }
      })
      .finally(() => { this.isUserCreating = false });
  }

  findAll() {
    this.userSrv.findAll()
      .then((data: User[]) => {
        this.users = data;
      })
      .catch(() => { });
  }

  paginate() {
    this.userSrv.paginate(this.itemsPerPage)
      .then((data: User[]) => {
        this.paginationData = data;
        this.users = this.paginationData.data;
      })
      .catch(() => { });
  }

  changePageSize(itemsPerPage: number) {
    this.itemsPerPage = itemsPerPage;
    this.userSrv.paginate(this.itemsPerPage)
      .then((data: User[]) => {
        this.paginationData = data;
        this.users = this.paginationData.data;
      })
      .catch(() => { });
  }

  changePagination(pageNumber: any) {
    this.userSrv.paginate(this.itemsPerPage, pageNumber)
      .then((data: User[]) => {
        this.paginationData = data;
        this.users = this.paginationData.data;
      })
      .catch(() => { });
  }

  /**
       * * @author Alioune Badara FAM
         * @copyright ABF
         * @link https://recrutore.atlassian.net/browse/RAD-105
         * @since 28.01.22
         * @description Affiche le modal pour éditer informations utilisateur
         * @param User
       */
  showModalEdit(user: User) {
    this.modalVisible = true;
    this.userUpdate = user
    this.nzTitle = "Modifier informations utilisateur : " + user.email
  }


  /**
     * * @author Alioune Badara FAM
       * @copyright ABF
       * @link https://recrutore.atlassian.net/browse/RAD-105
       * @since 28.01.22
       * @description Ferme le modal pour éditer informations utilisateur et actualise la pagination
     */
  closeEditModal() {
    this.modalVisible = false;
    this.paginate()
  }

  /**
       * * @author Alioune Badara FAM
         * @copyright ABF
         * @link https://recrutore.atlassian.net/browse/RAD-105
         * @since 28.01.22
         * @description Supprime un utilisateur
         * @param User
         * @returns Promise
       */
  delete(user: User) {
    this.userSrv.removeById(Number(user.id))
      .then(() => {
        const index = this.users.indexOf(user)
        if (index > -1) {
          this.users.splice(index, 1);
          this.findAll()
          this.userSrv.http.toastr.info("L'utilisateur " + user.name + " a été supprimé")
        }
      })
      .catch(() => { });
  }

  /**
       * * @author Alioune Badara FAM
         * @copyright ABF
         * @link https://recrutore.atlassian.net/browse/RAD-105
         * @since 28.01.22
         * @description Met à jour les modifications de l'utilisateur
         * @param User
         * @returns Promise
       */
  update(user: User) {
    this.userSrv.update(user)
      .then(() => {
        this.users = [...this.users];
        this.userUpdate = new User();
        this.userSrv.http.toastr.info("Informations utilisateur correctement modifiées")
        this.modalVisible = false;
      }).catch((err: PromiseError) => {
        if (err.validationError) {
          this.errors = err.data;
        }
      })

  }

  /**
     * * @author Alioune Badara FAM
       * @copyright ABF
       * @link https://recrutore.atlassian.net/browse/RAD-105
       * @since 28.01.22
       * @description Fais apparaître/disparaître le formulaire d'ajout d'administrateur
     */
  showAjoutForm() {
    this.formVisible = !this.formVisible
  }

  /**
     * * @author Alioune Badara FAM
       * @copyright ABF
       * @link https://recrutore.atlassian.net/browse/RAD-105
       * @since 28.01.22
       * @description Lance le modal pour pour la confirmation de suppression d'un utilisateur
       * @param User
     */
  showDeleteConfirm(user: User): void {
    this.modal.confirm({
      nzTitle: 'Êtes vous sûr de vouloir supprimer cet utilisateur',
      nzOkText: 'Oui, je suis sûr',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => this.delete(user),
      nzCancelText: 'Non, annuler',
    });
  }

  handleFileSelect(evt: any) {
    this.fileSrv.convertImageToBase64String(evt)
      .then((data: string) => {
        this.userModel.photo = data;
      })
      .catch(() => { });
  }

  /**
   * * @author Cheikh Tidiane GUEYE
     * @link https://recrutore.atlassian.net/browse/RAD-75
     * @since 02.02.22
     * @description Permet l'ouverture du modal pour contacter les utilisateurs
   */
  showContactModalForm(): void {
    this.isContactUserForm = true;
  }

  /**
   * * @author Cheikh Tidiane GUEYE
     * @link https://recrutore.atlassian.net/browse/RAD-75
     * @since 02.02.22
     * @description Permet la fermeture du modal pour contacter les utilisateurs
   */
  closeContactModalForm(): void {
    this.isContactUserForm = false;
  }

  /**
   * * @author Cheikh Tidiane GUEYE
     * @link https://recrutore.atlassian.net/browse/RAD-75
     * @since 02.02.22
     * @description Permet d'envoyer un message aux utilisateurs choisis.
   */
  sendUserMessage() {
    this.isUserMessageSending = true;
    for (let index = 0; index < this.users.length; index++) {
      if (this.users[index].selected == true) {
        this.userMessage.selectedEmails?.push(this.users[index].email);
      }
    }
    this.userSrv.sendUserMessage(this.userMessage)
      .then(() => {
        this.userSrv.http.toastr.success("Mail envoyé avec succès");
        this.userMessage = new UserMessage();
      }).catch(() => { })
      .finally(() => {
        this.isUserMessageSending = false;
        this.isContactUserForm = false;
      });
  }

  /**
   * * @author Cheikh Tidiane GUEYE
     * @link https://recrutore.atlassian.net/browse/RAD-75
     * @since 08.02.22
     * @description Permet de vérifier s'il existe des utilisateurs qui ont été sélectionnés ou non
  */
  verifyAllChecked(): void {
    if (this.users.filter(item => { return item.selected }).length > 0) {
      this.isShowSelect = false;
      this.userMessage.typeUser = "selection";
    } else {
      this.isShowSelect = true;
    }
    this.showContactModalForm();
  }

  /**
   * * @author Cheikh Tidiane GUEYE
     * @link https://recrutore.atlassian.net/browse/RAD-75
     * @since 08.02.22
     * @description Permet de mettre tous les selected des users à true si toute fois on clique sur le boutton tout selectionne et
     * le contraire si on y clique à niveau.
   */
  updateAllChecked() {
    this.indeterminate = false;
    if (this.allChecked) {
      this.users = this.users.map(item => ({
        ...item,
        selected: true
      }));
    } else {
      this.users = this.users.map(item => ({
        ...item,
        selected: false
      }));
    }
  }

  /**
   * @author Cheikh Tidiane GUEYE
   * @link https://recrutore.atlassian.net/browse/RAD-75
   * @since 08.02.22
   * @description Permet de mettre à jour l'attribut selected d'un utilisateur
   */
  updateSingleChecked(user: User) {
    user.selected = !user.selected;
    this.indeterminate = true;
  }

   /**
   * @author Mamadou lamine Bèye
   * @link https://recrutore.atlassian.net/browse/RAD-69
   * @since 10.02.22
   * @description Permet de filtrer
   */

   filterUser() {
    this.filterObj.firstDate = this.dateRange[0]
    this.filterObj.secondDate = this.dateRange[1]
    this.userSrv.filterUser(this.filterObj).then((response) => {
      this.users = response
    })
   }

}
