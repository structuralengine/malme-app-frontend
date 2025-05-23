import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { MsalService } from '@azure/msal-angular';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

interface KeycloakProfile {
  uid: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
}

interface Group {
  id: number;
  status: number;
  companyName: string;
  departmentName: string;
  bankName: string;
  bankBranchName: string;
  bankAccountType: string;
  bankAccountNumber: string;
  licenses: number;
}

interface Company {
  id: number;
  status: number;
  companyName: string;
  departmentName: string;
  bankName: string;
  bankBranchName: string;
  bankAccountType: string;
  bankAccountNumber: string;
  licenses: number;
}
interface SystemProfile {
  id: number;
  uid: string;
  firstName: string;
  lastName: string;
  email: string;
  roles: string[];
  group: Group | null;
}

export const tokenKey = 'malmeapp_token';
export const rolesKey = 'malmeapp_roles';
@Injectable({
  providedIn: 'root'
})
export class UserInfoService {
  public keycloakProfile: KeycloakProfile | null = null;
  public systemProfile: SystemProfile | null = null;
  public loadingSubject = new Subject<boolean>();
  private userInfoSubject = new BehaviorSubject<any>(null);
  public userRole: string[] = [];
  userInfo$ = this.userInfoSubject.asObservable();

  constructor(private http: HttpClient, private authService: MsalService) {}

  public syncSystemProfile() {
    this.http.post(`${environment.apiBaseUrl}/user/sync-b2c`, {}).subscribe({
      next: () => {
        this.loadingSubject.next(false);
        this.setUserProfile();
        this.setPermission();
      },
      error: (err) => {
        this.loadingSubject.next(false);
        console.log('error', err);
      }
    });
  }

  getSystemProfile(): void {
    this.getAcessToken().subscribe({
      next: (token) => {
        const header = new HttpHeaders({
          Authorization: `Bearer ${token}`
        });
        this.http.get(`${environment.apiBaseUrl}/user/profile`, { headers: header }).subscribe({
          next: (res: any) => {
            const group: Company = {
              id: res.company.id,
              status: res.company.status,
              companyName: res.company.companyName,
              departmentName: res.company.departmentName,
              bankName: res.company.bankName,
              bankBranchName: res.company.bankBranchName,
              bankAccountType: res.company.bankAccountType,
              bankAccountNumber: res.company.bankAccountNumber,
              licenses: res.company.licenses
            };
            this.systemProfile = {
              id: res.id,
              uid: res.azureB2CId,
              roles: res.roles,
              email: res.email,
              group: group
            } as SystemProfile;
          },
          error: (err) => {
            console.log(err);
          }
        });
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  getAcessToken(): Observable<string> {
    const request = { scopes: environment.apiConfig.scopes };
    return new Observable<string>((observer) => {
      this.authService.acquireTokenSilent(request).subscribe({
        next: (result) => {
          localStorage.setItem(tokenKey, result.accessToken);
          observer.next(result.accessToken);
          observer.complete();
        },
        error: (err) => {
          console.error('Token error:', err);
          observer.error(err);
        }
      });
    });
  }

  public setPermission() {
    this.http.get(`${environment.apiBaseUrl}/user/check-permission`).subscribe({
      next: (res: any) => {
        this.userRole = [];
        if (res.roles) {
          this.userRole = res.roles;
        }
      },
      error: (err) => {
        console.log('error', err);
      }
    });
  }

  public getToken(): string | null {
    return localStorage.getItem(tokenKey);
  }

  public setUserProfile() {
    this.http.get(`${environment.apiBaseUrl}/user/profile`).subscribe({
      next: (res: any) => {
        let group: any = null;
        if (res.company) {
          group = {
            id: res.company.id,
            status: res.company.status,
            companyName: res.company.companyName,
            departmentName: res.company.departmentName,
            bankName: res.company.bankName,
            bankBranchName: res.company.bankBranchName,
            bankAccountType: res.company.bankAccountType,
            bankAccountNumber: res.company.bankAccountNumber,
            licenses: res.company.licenses
          };
        }

        this.systemProfile = {
          id: res.id,
          uid: res.azureB2CId,
          firstName: res.firstName,
          lastName: res.lastName,
          email: res.email,
          roles: res.roles,
          group: group ?? null
        } as SystemProfile;
        localStorage.setItem(rolesKey, JSON.stringify(this.systemProfile.roles));
        this.userInfoSubject.next(this.systemProfile);
      },
      error: (err) => {
        console.log('error', err);
      }
    });
  }

  checkAdminRole() {
    const role = localStorage.getItem(rolesKey);
    if (role) {
      return JSON.parse(role).includes('Admin') ?? false;
    }
  }
}
