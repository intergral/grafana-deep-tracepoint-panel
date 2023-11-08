#!/usr/bin/env bash

#
#     Copyright (C) 2023  Intergral GmbH
#
#     This program is free software: you can redistribute it and/or modify
#     it under the terms of the GNU Affero General Public License as published by
#     the Free Software Foundation, either version 3 of the License, or
#     (at your option) any later version.
#
#     This program is distributed in the hope that it will be useful,
#     but WITHOUT ANY WARRANTY; without even the implied warranty of
#     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#     GNU Affero General Public License for more details.
#
#     You should have received a copy of the GNU Affero General Public License
#     along with this program.  If not, see <https://www.gnu.org/licenses/>.
#

rm -rf intergral-deep-tracepoint-panel || exit $?

rm *.zip* || exit $?

cp -r dist intergral-deep-tracepoint-panel  || exit $?

VERSION=$(cat package.json | grep version | awk -F'"' '{ print $4 }')

zip intergral-deep-tracepoint-panel-${VERSION}.zip intergral-deep-tracepoint-panel -r  || exit $?

md5sum intergral-deep-tracepoint-panel-${VERSION}.zip > intergral-deep-tracepoint-panel-${VERSION}.zip.md5  || exit $?

cat intergral-deep-tracepoint-panel-${VERSION}.zip.md5