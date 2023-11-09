/*
 *     Copyright (C) 2023  Intergral GmbH
 *
 *     This program is free software: you can redistribute it and/or modify
 *     it under the terms of the GNU Affero General Public License as published by
 *     the Free Software Foundation, either version 3 of the License, or
 *     (at your option) any later version.
 *
 *     This program is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *     GNU Affero General Public License for more details.
 *
 *     You should have received a copy of the GNU Affero General Public License
 *     along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import React, {useState} from "react";
import {TracepointArgs, TracepointPanelOptions} from "../types";
import {css, cx} from "@emotion/css";
import {Card, Collapse, HorizontalGroup, IconButton, Tooltip, useStyles2,} from "@grafana/ui";
import {TextView} from "./TextView";
import {toNumber} from "lodash";
import {PanelData} from "@grafana/data";
import {TracepointTabs} from "./TracepointTabs";

interface Props {
    index: number
    data: PanelData
    options: TracepointPanelOptions
    width: number;
}

const getStyles = () => ({
    cardHeader: css`
      font-size: 18pt;
      overflow: hidden;
      text-overflow: ellipsis;
    `,
    frameFile: css`
      color: #008800;
    `,
    frameLine: css`
      color: rgb(255 187 255);
    `,
    logLabel: css`
      margin-left: 20px;
      margin-bottom: 0;
    `,

    labelLocation: css`
      min-width: 200px;
      max-width: 200px;
      overflow: hidden;
      text-align: left;
    `,
    labelFireCount: css`
      margin-left: 25px;
      min-width: 120px;
      max-width: 120px;
      overflow: hidden;
      text-align: left;
    `,
    labelTargeting: css`
      margin-left: 25px;
      min-width: 240px;
      max-width: 240px;
      overflow: hidden;
      text-align: left;
    `,
    labelButton: css`
      margin-top: 4px;
    `,
    panelLabel: css`
      display: flex;
      flex-direction: row;
      align-items: center;
      width: 100%;
    `,

    descriptionBlock: css`
      display: flex;
      flex-direction: row;
    `,

    configBlock: css`
      display: flex;
      flex-direction: column;
    `,

    tabBlock: css`
      display: flex;
      flex-direction: column;
    `,
    rowActions: css`
      margin-left: auto;
    `
})

function parsePath(path: string) {
    const lastIndex = path.lastIndexOf('/');
    if (lastIndex === -1) {
        return null
    }
    return path.substring(lastIndex + 1)
}

function parseTpWindow(args: TracepointArgs) {
    if (args.window_start && args.window_end) {
        return `Between: ${args.window_start} - ${args.window_end}`
    }
    if (args.window_start && !args.window_end) {
        return `After: ${args.window_start}`

    }
    if (!args.window_start && args.window_end) {
        return `Before: ${args.window_start}`
    }
    return null
}

function parseTargeting(targeting: Record<string, string>) {
    let str = ""

    for (let key in targeting) {
        const val = targeting[key];
        str += ` ${key}="${val}"`
    }

    str = str.trim();

    if (str === "") {
        return "Targeting all instances."
    }
    return str
}


export const TracepointView: React.FC<Props> = ({index, data, width}: Props) => {
    const path = data.series[0].fields[1].values[index]
    const line = data.series[0].fields[2].values[index]
    const args = data.series[0].fields[3].values[index]
    const watches = data.series[0].fields[4].values[index]
    const targeting = data.series[0].fields[5].values[index]

    const [isOpen, setIsOpen] = useState(false)
    const styles = useStyles2(getStyles);
    const shortPath = parsePath(path)

    const fireCountVal = toNumber(args.fire_count ?? '1');
    const fireCount = args.fire_count === '-1' ? 'Always' : `${fireCountVal} time${fireCountVal === 1 ? '' : 's'}`;

    const window = parseTpWindow(args)

    const targetingPhrase = parseTargeting(targeting);
    const label = <div className={styles.panelLabel}>
        <div className={styles.labelButton}><IconButton name={isOpen ? "angle-down" : "angle-right"}
                                                        aria-label={"Expand"} size={"xl"}/></div>
        <Tooltip content={`${path}:${line}`}>
            <div className={styles.labelLocation}><span className={styles.frameFile}>{shortPath ?? path}</span><span
                className={styles.frameLine}>:{line}</span></div>
        </Tooltip>
        <div
            className={styles.labelFireCount}>Fire {fireCount}{fireCountVal > 1 || fireCountVal === -1 ? `, Rate ${args.fire_period ?? 1000}ms` : ""}</div>
        <Tooltip content={`Targeting ${targetingPhrase}`}>
            <div className={styles.labelTargeting}>Targeting {targetingPhrase}</div>
        </Tooltip>
        {args.log_msg ? (
            <Tooltip content={args.log_msg}>
                <pre className={styles.logLabel}>{args.log_msg}</pre>
            </Tooltip>
        ) : ""}
        {(watches ?? []).length ?
            (<div>
                <span>Has {watches.length} watcher{watches.length > 1 ? 's' : ''}</span>
            </div>) : ""}
        <div className={styles.rowActions}>
            <HorizontalGroup>
                <IconButton name={"eye"} aria-label="view" tooltip={"View snapshots"} onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    const links = data.series[0].fields[0].getLinks?.({valueRowIndex: index})
                    if (links) {
                        links[0].onClick?.(e)
                    }
                }}/>
                <IconButton name={"trash-alt"} aria-label="delete" tooltip={"Delete Tracepoint"} onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    const links = data.series[0].fields[6].getLinks?.({valueRowIndex: index})
                    if (links) {
                        links[0].onClick?.(e)
                    }
                }}/>
            </HorizontalGroup>
        </div>
    </div>

    return (
        <Collapse label={label} isOpen={isOpen} onToggle={() => setIsOpen(!isOpen)} collapsible={false}>
            <Card>
                <Card.Description>
                    <div className={cx(styles.descriptionBlock, css`
                      width: ${width}px
                    `)}>
                        <div className={cx(styles.configBlock, css`
                          width: ${width * 0.65}px;
                        `)}>
                            <div className={styles.cardHeader}>
                                <span className={styles.frameFile}>{path}</span><span
                                className={styles.frameLine}>:{line}</span>
                            </div>
                            {args.log_msg ? (<TextView label={"Log Message"} text={args.log_msg}/>) : ""}

                            {targeting ? (
                                <TextView label={"Targeting"} text={targetingPhrase}/>) : ""}
                            <TextView label={"Fire Count"} text={fireCount}/>
                            {window ? <TextView label={"Fire Window"} text={window}/> : ""}
                        </div>
                        <div className={cx(styles.tabBlock, css`
                          width: ${width * 0.32}px
                        `)}>
                            <TracepointTabs watches={watches} args={args}/>
                        </div>

                    </div>
                </Card.Description>
            </Card>
        </Collapse>
    )
}

