import {Injectable} from '@angular/core';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';

@Injectable({
    providedIn: 'root'
})
export class BreakpointsService {
    public isMobile = false;
    public isTablet = false;

    constructor(private breakpointObserver: BreakpointObserver) {
        this.breakpointObserver.observe(Breakpoints.Handset).subscribe(result => {
            this.isMobile = result.matches;
        });

        this.breakpointObserver.observe(Breakpoints.Tablet).subscribe(result => {
            this.isTablet = result.matches;
        });
    }

    public observe(value: string) {
        return this.breakpointObserver.observe(value);
    }
}
