import React from 'react';
import TestUtils from 'react-addons-test-utils';
import ReactDOM from 'react-dom';
import {renderComponent, expect, assert} from '../../test_helper';
import Button from '../../../src/components/button/Button';


describe('Button Component', () => {
    let component;

    beforeEach(()=> {
        component = renderComponent(Button);
    });

    it('Should have correct class', () => {
        expect(component).to.have.class('btn');
    });

    it('Should call onClick callback', (done) => {
        let doneOp = () => {
            done();
        };

        let instance = TestUtils.renderIntoDocument(
            <Button onClick={doneOp}>
                Button
            </Button>
        );
        TestUtils.Simulate.click(ReactDOM.findDOMNode(instance));
    });

    describe('disabled', ()=> {

        it('Should have correct class', ()=> {
            let component = renderComponent(Button, {disabled: true});
            expect(component).to.have.class('disabled');
        });

        it('Should not call onClick callback', (done)=> {
            let doneOp = () => {
                assert.fail(0, 1, 'onClick callback is called when button is disabled');
            };

            let instance = TestUtils.renderIntoDocument(
                <Button disabled onClick={doneOp}>
                    Button
                </Button>
            );
            TestUtils.Simulate.click(ReactDOM.findDOMNode(instance));
            done();
        });

    });

});