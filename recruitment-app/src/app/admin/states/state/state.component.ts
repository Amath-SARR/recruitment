import { Component, OnInit } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { PromiseError } from 'src/app/shared/classes/promise-error';
import { State } from '../state';
import { StateService } from '../state.service';

@Component({
  selector: 'app-state',
  templateUrl: './state.component.html',
  styleUrls: ['./state.component.css']
})
export class StateComponent implements OnInit {

  states : State[] = [];
  isCreating = false;
  stateModel = new State();
  errors:any = {};
  stateNouveau = new State();
  paginationData:any = {};
  itemsPerPage = 8;
  pageSizeOptions = [8, 16, 32, 64, 100];
  isVisible = false;
  isVisibleFormAjout = false;
  searchField = null;
  filterFields = ['nom','type'];
  state : State;
  constructor(public stateSrv: StateService, private modal: NzModalService) {
    this.state = Object.create(null);
  }

  ngOnInit(): void {
    this.paginate();
    this.stateModel = new State();
  }

  /**
   * Gère l'affichage de l'ensemble des statuts
   * @author Mariama Fatou Sarr DIOP
   * @since 26/01/2022
   * @return Promise
   */
  findAll(){
    this.stateSrv.findAll()
    .then((data: State[])=>{
      this.states = data;
    })
    .catch(()=>{ });
  }

  getBadgeColor(state:State){
      if (state.type=="initial"){
        return "green";
      }
      if(state.type=="final"){
        return "red";
      }
        return "orange";

  }

  showFormAjout(){
    if(this.isVisibleFormAjout){
      this.isVisibleFormAjout = false;
    }else{
      this.isVisibleFormAjout = true;
    }
  }

  paginate(){
    this.stateSrv.paginate(this.itemsPerPage)
      .then((data: State[])=> {
        this.paginationData = data;
        this.states = this.paginationData.data;
      })
      .catch(()=>{ });
  }

  changePageSize(itemsPerPage: number){
    this.itemsPerPage = itemsPerPage;
    this.stateSrv.paginate(this.itemsPerPage)
    .then((data : State[])=>{
      this.paginationData = data;
      this.states = this.paginationData.data;
    })
    .catch(()=>{ });
  }

  changePagination(pageNumber: any){
    this.stateSrv.paginate(this.itemsPerPage, pageNumber)
    .then((data: State[])=>{
      this.paginationData = data;
      this.states = this.paginationData.data;
    })
    .catch(()=>{ });
  }

  /**
  * Gère l'enregistrement d'un statut dans la base de données
   * @author Mariama Fatou Sarr DIOP
   * @since 26/01/2022
   * @return Promise
   */
  save(){
    this.isCreating = true;
    this.stateSrv.save(this.stateModel)
    .then((data: State)=>{
      this.states = [data, ...this.states];
      this.stateModel = new State();
      this.stateSrv.http.toastr.success("Statut créé avec succès");
    }).catch((err: PromiseError) => {
      if (err.validationError) {
        this.errors = err.data;
      }
    }).finally(()=>this.isCreating = false);
  }

  /**
   * Gère la mise à jour d'un statut
   * @author Mariama Fatou Sarr DIOP
   * @since 26/01/2022
   * @return Promise
   */
  update(state:State){
      this.stateSrv.update(state)
      .then(()=>{
        this.states=[...this.states];
        this.stateNouveau = new State();
        this.stateSrv.http.toastr.info("Modification effectuée avec succès");
        this.isVisible = false;
      }).catch((err: PromiseError)=>{
        if(err.validationError){
          this.errors = err.data;
        }
      })
  }

  /**
   * Gère la suppression d'un statut
   * @author Mariama Fatou Sarr DIOP
   * @since 26/01/2022
   * @return Promise
   */
  showModal(state:State): void {
    this.isVisible = true;
    this.stateNouveau= state;
    console.log(this.stateNouveau.nom);

  }

  handleCancel(): void {
    this.isVisible = false;
  }

  delete(state:State):void{
    this.state=state
    this.modal.confirm({
      nzTitle:'Voulez vous supprimer ce statut ?',
      nzOkText: 'Oui',
      nzOkType : 'primary',
      nzOkDanger : true,
      nzOnOk: ()=>this.stateSrv.removeObject(this.state)
      .then(()=>{
        this.stateSrv.http.toastr.success("Le statut a été supprimé avec succès!");
        this.ngOnInit();
      }).catch((err: PromiseError)=>{
        if(err.validationError){
          this.errors = err.data;
        }
      }),
      nzCancelText: 'Non',
    });
  }


}
