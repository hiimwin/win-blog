import { Injectable } from '@angular/core';

@Injectable({providedIn: 'root'})
export class UrlConstants{
    public static LOGIN = "/auth/login";
    public static HOME = "/dashboard";
    public static ACCESS_DENIED = "/auth/403";
}