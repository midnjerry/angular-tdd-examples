import { HeroesComponent } from "./heroes.component";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA, Component, Input, Directive } from "@angular/core";
import { HeroService } from "../hero.service";
import { of } from "rxjs";
import { Hero } from "../hero";
import { By } from "@angular/platform-browser";
import { HeroComponent } from "../hero/hero.component";

//To Mock Router
@Directive({
    selector: '[routerLink]',
    host: { '(click)': 'onClick()' }
})
export class RouterLinkDirectiveStub {
    @Input('routerLink') linkParams: any;
    navigatedTo: any = null;

    onClick() {
        this.navigatedTo = this.linkParams;
    }
}
//*********************************************

describe('HeroesComponent (deep tests)', () => {
    let fixture: ComponentFixture<HeroesComponent>;
    let mockHeroService;
    let HEROES;

    beforeEach(() => {
        mockHeroService = jasmine.createSpyObj(['getHeroes', 'addHero', 'deleteHero']);

        HEROES = [
            { id: 1, name: 'SpiderDude', strength: 8 },
            { id: 2, name: 'Wonderful Woman', strength: 24 },
            { id: 3, name: 'SuperDude', strength: 55 }
        ]

        //TestBed calls ngOnInit of component automatically
        TestBed.configureTestingModule({
            declarations: [
                HeroesComponent,
                HeroComponent,
                RouterLinkDirectiveStub
            ],
            providers: [
                { provide: HeroService, useValue: mockHeroService }
            ],
            //schemas: [NO_ERRORS_SCHEMA]
        })
        fixture = TestBed.createComponent(HeroesComponent);
    })

    it('should render each hero as a HeroComponent', () => {
        mockHeroService.getHeroes.and.returnValue(of(HEROES));

        //run ngOnInit
        fixture.detectChanges();

        const heroComponentDEs = fixture.debugElement.queryAll(By.directive(HeroComponent));
        expect(heroComponentDEs.length).toEqual(3);
        expect(heroComponentDEs[0].componentInstance.hero.name).toEqual('SpiderDude');

        for (let i = 0; i < HEROES.length; i++) {
            expect(heroComponentDEs[i].componentInstance.hero).toEqual(HEROES[i]);
        }
    })

    it(`should call heroService.deleteHero when the Hero
    Component's delete button is clicked`, () => {
            //spy on delete method being called from real
            spyOn(fixture.componentInstance, 'delete');
            mockHeroService.getHeroes.and.returnValue(of(HEROES));

            fixture.detectChanges();

            //By.directive - also return decorator and attribute directives
            const heroComponents = fixture.debugElement.queryAll(By.directive(HeroComponent));
            heroComponents[0].query(By.css('button'))
                //Passing empty object with stopPropagation dummy method
                .triggerEventHandler('click', { stopPropagation: () => { } });

            expect(fixture.componentInstance.delete).toHaveBeenCalledWith(HEROES[0]);
        })

    it(`should call heroService.deleteHero when the Hero
    Component's delete button is clicked`, () => {
            //example of seeing if parent handles child component


            //spy on delete method being called from real
            spyOn(fixture.componentInstance, 'delete');
            mockHeroService.getHeroes.and.returnValue(of(HEROES));

            fixture.detectChanges();

            //By.directive - also return decorator and attribute directives
            const heroComponents = fixture.debugElement.queryAll(By.directive(HeroComponent));

            //This is to emit event without "clicking".
            (<HeroComponent>heroComponents[0].componentInstance).delete.emit(undefined)

            expect(fixture.componentInstance.delete).toHaveBeenCalledWith(HEROES[0]);
        })

    it(`should call heroService.deleteHero when the Hero
    Component's delete button is clicked`, () => {
            //example of seeing if parent handles child component


            //spy on delete method being called from real
            spyOn(fixture.componentInstance, 'delete');
            mockHeroService.getHeroes.and.returnValue(of(HEROES));

            fixture.detectChanges();

            //By.directive - also return decorator and attribute directives
            const heroComponents = fixture.debugElement.queryAll(By.directive(HeroComponent));

            //This is to emit event without "clicking".
            // (<HeroComponent>heroComponents[0].componentInstance).delete.emit(undefined)
            heroComponents[0].triggerEventHandler('delete', null);

            expect(fixture.componentInstance.delete).toHaveBeenCalledWith(HEROES[0]);
        })

    it('should add a new hero to the hero list when add button is clicked', () => {
        //add text to input box
        mockHeroService.getHeroes.and.returnValue(of(HEROES));
        fixture.detectChanges();
        const name = "Mr. Ice";

        mockHeroService.addHero.and.returnValue(of({ id: 5, name: name, strength: 4 }));
        const inputElement = fixture.debugElement.query(By.css('input')).nativeElement;
        const addButton = fixture.debugElement.queryAll(By.css('button'))[0];

        inputElement.value = name;
        addButton.triggerEventHandler('click', null);
        //Make sure this is run so double-binding changes are captured
        fixture.detectChanges();

        const heroText = fixture.debugElement.query(By.css('ul')).nativeElement.textContent;
        expect(heroText).toContain(name);
    })

    it('should have the correct route for the first hero', () => {
        mockHeroService.getHeroes.and.returnValue(of(HEROES));
        fixture.detectChanges();
        const heroComponents = fixture.debugElement.queryAll(By.directive(HeroComponent));

        let routerLink = heroComponents[0]
            .query(By.directive(RouterLinkDirectiveStub))
            .injector.get(RouterLinkDirectiveStub);

        heroComponents[0].query(By.css('a')).triggerEventHandler('click', null);
        expect(routerLink.navigatedTo).toBe('/detail/1');
    })

    //Principles of Testing
    // 1. Don't get the framework
    // 2. Test your code  (are you interacting with framework correctly)
    //     For routing, don't actually route, just test where it goes
});