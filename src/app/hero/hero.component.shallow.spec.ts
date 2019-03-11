import { TestBed, ComponentFixture } from "@angular/core/testing";
import { HeroComponent } from "./hero.component";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { By } from "@angular/platform-browser";

describe('HeroComponent (shallow tests)', () => {
    let fixture: ComponentFixture<HeroComponent>
    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [HeroComponent],
            schemas:[NO_ERRORS_SCHEMA]
        });
        fixture = TestBed.createComponent(HeroComponent);
    });

    it('should have the correct hero', () => {
        fixture.componentInstance.hero = { id: 1, name: 'SuperDude', strength: 3 };
        expect(fixture.componentInstance.hero.name).toEqual('SuperDude');
    });

    it('should render the hero name in an anchor tag', () => {
        fixture.componentInstance.hero = {id: 1, name: 'SuperDude', strength: 3};

        //Run this to update bindings that may exist in component
        fixture.detectChanges();

        let debugElement = fixture.debugElement.query(By.css('a'));
        expect(debugElement.nativeElement.textContent).toContain('SuperDude');

        //debugElement exposes different variants.
        //It allows exposure to directive
        

        expect(fixture.nativeElement.querySelector('a').textContent).toContain('SuperDude')
    })
})