import React, {Component, PropTypes} from 'react';
import {stripTime, formatDuration} from './utils';
import './ResultItem.css';

const LANG_ORDER = new Map(['en', 'he', 'ru', 'es', 'it', 'de', 'nl', 'fr', 'pt', 'tr', 'pl', 'ar', 'hu', 'fi', 'lt',
    'ja', 'bg', 'ka', 'no', 'sv', 'hr', 'zh', 'fa', 'ro', 'hi', 'mk', 'sl', 'lv', 'sk', 'cs', 'ua']
    .map((x, i) => [x, i + 1]));

const FILE_TYPE_ORDER = new Map(['video', 'audio', 'image', 'text', 'sheet', 'banner', 'presentation']
    .map((x, i) => [x, i + 1]));



class ResultItem extends Component {
    static propTypes = {
        data: PropTypes.object.isRequired
    };

    renderDetails() {
        const data = this.props.data,
            source = data._source;
        return <div className="item-details">
            <ul className="details-list">
                <li><strong>Score:</strong> {data._score}</li>
                <li><strong>ID:</strong> {data._id}</li>
                <li><strong>Film Date:</strong> {stripTime(source.film_date)}</li>
                <li><strong>Type:</strong> {source.content_type}</li>
            </ul>
        </div>;
    }

    renderUnits() {
        return <div className="item-units">
            {this.props.data._source.content_units.map(x => this.renderUnit(x))}
        </div>
    }

    renderUnit(unit) {
        let name = unit.names[unit.original_language],
            description = unit.descriptions[unit.original_language];

        for (let lang in LANG_ORDER.keys()) {
            if (typeof name === 'undefined' || name === "") {
                name = unit.names[lang]
            }
            if (typeof description === 'undefined' || description === "") {
                description = unit.descriptions[lang]
            }
        }

        return <div className="item-unit" key={unit.mdb_uid}>
            <div className="item-unit-details">
                <ul className="details-list">
                    <li><strong>MDB:</strong> {unit.mdb_uid}</li>
                    <li><strong>Type:</strong> {unit.content_type}</li>
                    <li><strong>Film Date:</strong> {stripTime(unit.film_date)}</li>
                    <li><strong>Duration:</strong> {formatDuration(unit.duration)}</li>
                    <li><strong>Language:</strong> {unit.original_language}</li>
                    <li><strong>Secure:</strong> {unit.secure}</li>
                    <li><strong>Relation:</strong> {unit.name_in_collection}</li>
                </ul>
            </div>
            <div className="item-unit-title">
                <span className="item-unit-name">{name}</span>
                <br/>
                <div className="item-unit-description">{description}</div>
                <br/>
                <div className="item-unit-files">
                    {this.renderFiles(unit.files)}
                </div>
            </div>
        </div>
    }

    renderFiles(files) {
        const {byLang, sortedTypes} = this.sortFiles(files);

        return <table className="item-files-table">
            <thead>
            <tr>
                <th>Type</th>
                {byLang.map(x => <th key={x[0]}>{x[0]}</th>)}
            </tr>
            </thead>
            <tbody>
            {sortedTypes.map(x => {
                return <tr key={x}>
                    <td>{x}</td>
                    {byLang.map(y => {
                        const files = y[1][x] || [];
                        return <td key={y[0]}>
                            {files.map(z => <a href={"files/" + z.mdb_uid} key={z.mdb_uid} target="_blank" title={z.name}>
                            {z.mdb_uid}
                            </a>)}
                        </td>
                    })}
                </tr>;
            })}
            </tbody>
        </table>
    }

    sortFiles(files) {
        // Group files by language and type
        let allTypes = new Set(),
            byLangAndType = files.reduce((groups, item) => {
                const i = item.language,
                    j = item.type;

                allTypes.add(j);

                groups[i] = groups[i] || {};
                groups[i][j] = groups[i][j] || [];
                groups[i][j].push(item);
                return groups;
            }, {});

        // Sort by language order
        let byLang = Object.keys(byLangAndType).map(x => [x, byLangAndType[x]]);
        byLang.sort((a, b) => {
            const k1 = LANG_ORDER.get(a[0]) || LANG_ORDER.size + 1,
                k2 = LANG_ORDER.get(b[0]) || LANG_ORDER.size + 1;
            return k1 - k2;
        });

        // Sort all available file types
        let sortedTypes = Array.from(allTypes).sort((a, b) => {
            const k1 = FILE_TYPE_ORDER.get(a) || FILE_TYPE_ORDER.size + 1,
                k2 = FILE_TYPE_ORDER.get(b) || FILE_TYPE_ORDER.size + 1;
            return k1 - k2;
        });

        return {byLang, sortedTypes};
    }

    render() {
        return (
            <div className="results-item">
                {this.renderDetails()}
                {this.renderUnits()}
            </div>
        );
    }
}

export default ResultItem;
