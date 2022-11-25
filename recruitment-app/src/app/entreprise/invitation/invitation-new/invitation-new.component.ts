import { Component, OnInit } from '@angular/core';
import { Invitation } from '../invitation';
import { InvitationService } from '../invitation.service';
import { EntrepriseService } from '../../../default/entreprise/entreprise.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Entreprise } from 'src/app/default/entreprise/entreprise';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-invitation-new',
  templateUrl: './invitation-new.component.html',
  styleUrls: ['./invitation-new.component.css']
})
export class InvitationNewComponent implements OnInit {
  invitation: Invitation;
  isInvitationCreating = false;
  entreprise: Entreprise;
  confirmModal?: NzModalRef;

  constructor(public invitationSrv: InvitationService, public entrepriseSrv: EntrepriseService,
    public activatedRoute: ActivatedRoute,private modal: NzModalService,public router: Router) {
    this.invitation = new Invitation();
    this.entreprise = Object.create(null);
  }

  ngOnInit(): void {
    this.getEntrepriseByUid();
  }

  save() {
    this.isInvitationCreating = true;
    this.invitation.entreprise_id = this.entreprise.id;
    this.invitationSrv.save(this.invitation)
      .then(() => {
        this.showModalConfirm()
        this.invitationSrv.http.toastr.success('Invitation envoyée avec succès.');
      })
      .catch(() => { })
      .finally(() => this.isInvitationCreating = false);
  }

  getEntrepriseByUid() {
    this.entrepriseSrv.findByUid(this.activatedRoute.snapshot.params['uid'])
      .then((data) => this.entreprise = data)
      .catch(()=>{});
  }

  showModalConfirm(): void {
    this.confirmModal = this.modal.confirm({
      nzTitle: 'Désirez-vous envoyer une autre invitation?',
      nzOkText: 'Oui',
      nzCancelText: 'Non',
      nzOnCancel: () => this.router.navigate(['entreprise',this.activatedRoute.snapshot.params['uid']]),
      nzOnOk: ()=>this.invitation = new Invitation()
    });
  }

}
