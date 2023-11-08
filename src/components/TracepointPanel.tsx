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

import React from 'react';
import {PanelProps} from '@grafana/data';
import {TracepointPanelOptions} from 'types';
import {css, cx} from '@emotion/css';
import {useStyles2} from '@grafana/ui';

interface Props extends PanelProps<TracepointPanelOptions> {
}

const getStyles = () => ({
  wrapper: css`
    font-family: monospace;
    position: relative;
  `,
  fullHeight: css`
    height: 100%;
  `,
});

export const TracepointPanel: React.FC<Props> = ({options, data, width, height}) => {
  const styles = useStyles2(getStyles);


  return (
    <div
      className={cx(
        styles.wrapper,
        css`
          width: ${width}px;
          height: ${height}px;
        `
      )}
    >
      <div className={cx(
          css`
            display: flex;
            flex-direction: column;
          `
      )}>

      </div>
    </div>
  );
};
