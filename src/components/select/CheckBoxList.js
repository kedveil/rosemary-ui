import '../../assets/scss/components/_check-box-list.scss';

import React from 'react';
import ReactDOM from 'react-dom';
import find from 'lodash/find';
import Immutable from 'immutable';
import ReactList from 'react-list';

import {isDefined, findIdentifiables} from '../../util/utils';
import CheckBox from '../CheckBox';

const PROPERTY_TYPES = {
    value: React.PropTypes.arrayOf(React.PropTypes.number.isRequired),
    options: React.PropTypes.arrayOf(React.PropTypes.shape({
        id: React.PropTypes.number.isRequired,
        displayString: React.PropTypes.string.isRequired
    })),
    onChange: React.PropTypes.func
};
const DEFAULT_PROPS = {};

class CheckBoxList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            selected: findIdentifiables(this.props.options, this.props.value),
            counter: 0
        };

        this.renderItem = this.renderItem.bind(this);
        this.renderOptions = this.renderOptions.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        let isValueChanged = nextProps.value !== this.props.value;
        let isOptionsChanged = nextProps.options !== this.props.options;

        if (isValueChanged || isOptionsChanged) {
            this.setState({
                selected: findIdentifiables(nextProps.options, nextProps.value),
                counter: this.state.counter + 1
            });
        }
    }

    isSelected(option) {
        let found = find(this.state.selected, (selected) => {
            if (option.id === selected.id) {
                return true;
            }
        });

        if (found) {
            return true;
        } else {
            return false;
        }
    }

    select(option) {
        let selected;

        if (!this.isSelected(option)) {
            selected = [option].concat(this.state.selected);
        } else {
            selected = Immutable.fromJS(this.state.selected).filter((item) => {
                return item.get('id') !== option.id;
            }).toJS();
        }

        if (!this.isControlled()) {
            this.setState({
                selected,
                counter: this.state.counter + 1
            });
        }

        if (this.props.onChange) {
            this.props.onChange(selected);
        }
    }

    isControlled() {
        return isDefined(this.props.value);
    }

    renderItem(index, key) {
        let option = this.props.options[index];
        let selected = this.isSelected(option);

        return (
            <tr className="check-box-list__item" key={key} onClick={() => this.select(option)}>
                <td className="check-box-list__check-box">
                    <CheckBox value={selected}/>
                </td>
                <td className="check-box-list__label">
                    {option.displayString}
                </td>
            </tr>
        );
    }

    renderOptions(items, ref) {
        return (
            <table className="check-box-list__table">
                <colgroup>
                    <col className="check-box-list__check-box-column"/>
                    <col/>
                </colgroup>
                <tbody ref={ref}>
                {items}
                </tbody>
            </table>
        );
    }

    render() {
        return (
            <ReactList
                itemRenderer={this.renderItem}
                itemsRenderer={this.renderOptions}
                length={this.props.options.length}
                type="uniform"
                justToUpdate={this.state.counter}
                />
        );
    }
}

CheckBoxList.propTypes = PROPERTY_TYPES;
CheckBoxList.defaultProps = DEFAULT_PROPS;

export default CheckBoxList;