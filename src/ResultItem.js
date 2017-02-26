import React, {Component, PropTypes} from 'react';
import './ResultItem.css';

const SERVER_MAP = {
    "offline": "http://www.kabbalahmedia.info/offline",
    "kids-2002": "http://files.kabbalahmedia.info/kids/2002",
    "kids-2003": "http://files.kabbalahmedia.info/kids/2003",
    "kids-2001": "http://files.kabbalahmedia.info/kids/2001",
    "WorldsBeyondbook": "http://files.kabbalahmedia.info/CD/WorldsBeyond",
    "ShlaveyHasulamBook": "http://files.kabbalahmedia.info/CD/ShlaveiHaSulam1",
    "ShlaveyHasulamBook2": "http://files.kabbalahmedia.info/CD/ShlaveiHaSulam2",
    "ShlaveyHasulamBook3": "http://files.kabbalahmedia.info/CD/ShlaveiHaSulam3",
    "MEKOROT": "http://files.kabbalahmedia.info/mekorot",
    "VIDEO_FOR_SITE": "http://files.kabbalahmedia.info/videoforsite",
    "VIDEO-EU": "http://files.kabbalahmedia.info/video",
    "AUDIO-EU": "http://files.kabbalahmedia.info/audio",
    "FILES-EU": "http://files.kabbalahmedia.info/files",
    "TEXTS": "http://files.kabbalahmedia.info/texts",
    "MUSIC-EU": "http://files.kabbalahmedia.info/MP3/music"
};

const LANG_ORDER = new Map(['en', 'he', 'ru', 'es', 'it', 'de', 'nl', 'fr', 'pt', 'tr', 'pl', 'ar', 'hu', 'fi', 'lt',
    'ja', 'bg', 'ka', 'no', 'sv', 'hr', 'zh', 'fa', 'ro', 'hi', 'mk', 'sl', 'lv', 'sk', 'cs', 'ua']
    .map((x, i) => [x, i + 1]));
const FILE_TYPE_ORDER = new Map(['mp3', 'wmv', 'mp4', 'flv', 'doc', 'jpg', 'zip', 'xls', 'docx', 'htm', 'pdf', 'wma',
    'epub', '.mp', 'gif', 'bmp', 'swf', 'rb', '.wm', 'rtf', 'mid', 'mov', 'fb2', 'ZIP', 'asf', 'tmp', 'tif', 'pps',
    'mpg', 'avi', 'rar', 'wav', 'sfk', 'php', 'm3', 'son', 'Doc', 'ppt', 'aac', 'FLV', 'txt', 'JPG', '7z', 'DOC', 'WMV',
    'lnk'].map((x, i) => [x, i + 1]));

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
                <li><strong>Index:</strong> {data._index}</li>
                <li><strong>ID:</strong> {data._id}</li>
                <li><strong>Film Date:</strong> {source.film_date}</li>
                <li><strong>Kmedia ID:</strong> {source.kmedia_id}</li>
            </ul>
        </div>;
    }

    prepareContainers() {
        const data = this.props.data,
            source = data._source,
            highlight = data.highlight;

        let containers = source.containers;

        // Attach search hit highlight information
        if (!!highlight) {
            const descriptionHighlight = data.highlight["containers.description"] || [],
                fullDescriptionHighlight = data.highlight["containers.full_description"] || [];

            containers.forEach((x, i) => {
                x["highlight"] = {
                    "description": i < descriptionHighlight.length ? descriptionHighlight[i] : null,
                    "full_description": i < fullDescriptionHighlight.length ? fullDescriptionHighlight[i] : null
                };
            });
        }

        // Sort by part of lesson
        return containers.sort((a, b) => a.position - b.position);
    }

    renderContainers() {
        return <div className="item-containers">
            {this.prepareContainers().map(x => this.renderContainer(x))}
        </div>
    }

    renderContainer(container) {
        return <div className="item-container" key={container.kmedia_id}>
            <div className="item-container-details">
                <ul className="details-list">
                    <li><strong>Film Date:</strong> {container.filmdate}</li>
                    <li><strong>Duration:</strong> {container.playtime_secs}</li>
                    <li><strong>Position:</strong> {container.position}</li>
                    <li><strong>Kmedia ID:</strong> {container.kmedia_id}</li>
                    <li><strong>Secure:</strong> {container.secure}</li>
                </ul>
            </div>
            <div className="item-container-title">
                {!!container.highlight.description ?
                    <span className="item-container-description"
                          dangerouslySetInnerHTML={{__html: container.highlight.description}}/> :
                    container.description
                }
                &nbsp;&nbsp;
                <a href={"http://kabbalahmedia.info/ui/" + container.kmedia_id} target="_blank">kmedia</a>
                <br/>
                <small>{container.name}</small>
                <br/>
                <br/>
                {container.full_description ?
                    <div className="item-container-full-description">
                        {!!container.highlight.full_description ?
                            <span dangerouslySetInnerHTML={{__html: container.highlight.full_description}}/> :
                            container.full_description}
                    </div> :
                    null
                }
                <br/>
                <br/>
                <div className="item-container-files">
                    {this.renderFiles(container.file_assets)}
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
                            {files.map(z => <a href={SERVER_MAP[z.server_name_id] + "/" + z.name}
                                               key={z.kmedia_id}
                                               target="_blank">
                                {z.kmedia_id}
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
                const i = item.lang,
                    j = item.asset_type_id;

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
            const k1 = FILE_TYPE_ORDER.get(a[0]) || LANG_ORDER.size + 1,
                k2 = FILE_TYPE_ORDER.get(b[0]) || LANG_ORDER.size + 1;
            return k1 - k2;
        });

        return {byLang, sortedTypes};
    }

    render() {
        return (
            <div className="results-item">
                {this.renderDetails()}
                {this.renderContainers()}
            </div>
        );
    }
}

export default ResultItem;
