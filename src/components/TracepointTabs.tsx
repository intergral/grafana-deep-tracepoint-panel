import React, {useState} from "react";
import {Tab, TabContent, TabsBar, useStyles2, VerticalGroup} from "@grafana/ui";
import {TracepointArgs} from "../types";
import {css} from "@emotion/css";

interface Props {
    watches: string[]
    args: TracepointArgs
}

const tabs = [
    {
        label: 'Watches',
        active: true,
    },
    {
        label: 'Args',
        active: false,
    },
];


export interface ItemViewProps {
    itemKey: string;
    itemValue: string;
    keyDecoration?: JSX.Element | boolean | string;
    valueDecoration?: JSX.Element | boolean | string;
    border?: boolean;
}

const itemStyles = () => ({
    itemKey: css`
      width: 50px;
      text-align: right;
      font-weight: bolder;
      color: #808080;
    `,
    itemValue: css`
      font-size: larger;
    `,
    itemView: css`
      border-bottom: 1px solid grey;
    `,
    itemKeyLine: css`
      margin-top: 5px;
    `,
    itemValueLine: css`
      padding-left: 10px;
      margin-top: 5px;
      margin-bottom: 5px;
      word-break: break-all;
    `,
    clearList: css`
      list-style: none;
    `,
    textCenter: css`
      text-align: center;
      font-size: 1rem;
    `,
    scroll: css`
      overflow-y: scroll;
    `,
    txtLight: css`
      font-weight: lighter;
      color: #808080;
    `,
})

export function ItemView({itemKey, itemValue, keyDecoration, valueDecoration, border = true}: ItemViewProps) {
    const styles = useStyles2(itemStyles);

    return (
        <div className={border ? styles.itemView : ''}>
            <div className={styles.itemKeyLine}>
        <span className={styles.itemKey}>
          {itemKey}
            {keyDecoration}
        </span>
            </div>
            <div className={styles.itemValueLine}>
        <span className={styles.itemValue}>
          {itemValue}
            {valueDecoration}
        </span>
            </div>
        </div>
    );
}

export const TracepointTabs: React.FC<Props> = ({watches, args}: Props) => {
    const styles = useStyles2(itemStyles);
    if (watches && watches.length) {
        tabs[0].active = false;
        tabs[1].active = true;
    }
    const [state, updateState] = useState(tabs);


    const displayArgs = (args: TracepointArgs) => {
        const ignoredArgs = ['fire_count', 'fire_period'];

        function ignoredKey(value: string): boolean {
            return !ignoredArgs.includes(value);
        }

        const filteredArgs = Object.keys(args ?? {}).filter(ignoredKey);

        if (!filteredArgs.length) {
            return (
                <div className={styles.textCenter}>
                    <span>No additional args</span>
                </div>
            );
        }
        return (
            <VerticalGroup>
                <ul className={styles.clearList}>
                    {filteredArgs.map((key, index) => {
                        const value = args[key];
                        return (
                            <li key={index}>
                                <ItemView itemKey={key} itemValue={value} border={false}/>
                            </li>
                        );
                    })}
                </ul>
            </VerticalGroup>
        );
    };

    const displayWatches = (watches: string[]) => {
        if (!watches.length) {
            return (
                <div className={styles.textCenter}>
                    <span>No watches configured</span>
                </div>
            );
        }
        return (
            <VerticalGroup>
                <ul className={styles.clearList}>
                    {watches.map((watch, index) => {
                        return (
                            <li key={index}>
                                <span>{watch}</span>
                            </li>
                        );
                    })}
                </ul>
            </VerticalGroup>
        );
    };


    return (
        <>
            <TabsBar>
                {state.map((tab, index) => {
                    return (
                        <Tab
                            key={index}
                            label={tab.label}
                            active={tab.active}
                            onChangeTab={() =>
                                updateState(
                                    state.map((tab, idx) => ({
                                        ...tab,
                                        active: idx === index,
                                    }))
                                )
                            }
                        />
                    );
                })}
            </TabsBar>
            <TabContent
                className={styles.scroll}>
                {state[0].active && <ItemView itemKey="Watches" itemValue=""
                                              valueDecoration={displayWatches(watches ?? [])}/>}
                {state[1].active && <ItemView
                    itemKey="Args"
                    keyDecoration={<span className={styles.txtLight}> (additional)</span>}
                    itemValue=""
                    valueDecoration={displayArgs(args)}
                />}
            </TabContent>
        </>
    )
}
