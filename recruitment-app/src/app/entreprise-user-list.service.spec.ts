import { TestBed } from '@angular/core/testing';

import { EntrepriseUserListService } from './entreprise-user-list.service';

describe('EntrepriseUserListService', () => {
  let service: EntrepriseUserListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EntrepriseUserListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
