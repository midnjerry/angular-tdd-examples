import { TestBed, ComponentFixture, fakeAsync, tick, flush, async } from "@angular/core/testing";
import { HeroDetailComponent } from "./hero-detail.component";
import { ActivatedRoute } from "@angular/router";
import { HeroService } from "../hero.service";
import { Location } from '@angular/common';
import { of } from "rxjs";
import { FormsModule } from "@angular/forms";


// Note:
// You can run code coverage report with:
// npm 
// We're testing component that uses routing...
// ng test --code-coverage

//You can set up npm with:

//"gencode": "ng test --code-coverage"
//npm run gencode

describe('HeroDetailComponent', () => {
    let fixture: ComponentFixture<HeroDetailComponent>;
    let mockActivatedRoute, mockHeroService, mockLocation;

    beforeEach(() => {
        mockActivatedRoute = {
            snapshot: {
                paramMap: {
                    get: () => { return '3'; }
                }
            }
        }
        mockHeroService = jasmine.createSpyObj(['getHero', 'updateHero']);
        mockLocation = jasmine.createSpyObj(['back']);
        TestBed.configureTestingModule({
            imports: [FormsModule],
            declarations: [HeroDetailComponent],
            providers: [
                { provide: ActivatedRoute, useValue: mockActivatedRoute },
                { provide: HeroService, useValue: mockHeroService },
                { provide: Location, useValue: mockLocation },
            ]
        });
        fixture = TestBed.createComponent(HeroDetailComponent);
        mockHeroService.getHero.and.returnValue(of({ id: 3, name: 'SuperDude', strength: 100 }))
    });

    it('should render hero name in a h2 tag', () => {
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('h2').textContent).toContain('SUPERDUDE')
    });

    it('should call updateHero when save is called', (done) => {
        mockHeroService.updateHero.and.returnValue(of({}));
        fixture.detectChanges();

        fixture.componentInstance.save();

        setTimeout(() => {
            expect(mockHeroService.updateHero).toHaveBeenCalled();
            done();
        }, 300);
    })

    it('should call updateHero when save is called (fake async)', fakeAsync(() => {
        mockHeroService.updateHero.and.returnValue(of({}));
        fixture.detectChanges();

        fixture.componentInstance.save();
        //If you set tick(240) the test will fail because mockHeroService.updateHero call is not made.
        tick(250);

        //You can use flush() to fast forward clock so all task are run.

        expect(mockHeroService.updateHero).toHaveBeenCalled();
    }))

    //fakeAsync works with promise and timeout
    it('should call updateHero when save is called (fake async)', fakeAsync(() => {
        mockHeroService.updateHero.and.returnValue(of({}));
        fixture.detectChanges();

        fixture.componentInstance.save();
        flush();

        expect(mockHeroService.updateHero).toHaveBeenCalled();
    }));

    //async only works with promises
    it('should call updateHero when save is called (using promises)', async(() => {
        mockHeroService.updateHero.and.returnValue(of({}));
        fixture.detectChanges();

        fixture.componentInstance.save2();

        fixture.whenStable().then(() => {
            expect(mockHeroService.updateHero).toHaveBeenCalled();
        });
    }));
})