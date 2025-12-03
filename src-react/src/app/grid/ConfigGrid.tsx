import {useEffect, useState} from "react";
import {type Column, type DefaultCellTypes, type Id, ReactGrid, type Row} from "@silevis/reactgrid";
import {useDynamicSlice} from "@/store/hooks.ts";
import {
  type ConfigsActions,
  type ConfigsState,
  type ConfigTable,
  createConfigsSlice
} from "@/app/config/configsSlice.ts";

interface Props {
  configKey: string
}

function ConfigGrid({configKey}: Props) {
  const {
    state: configsState,
    // actions: configsActions,
    // dispatch
  } = useDynamicSlice<ConfigsState, ConfigsActions>("CONFIGS", createConfigsSlice)
  const defaultConfigTable: ConfigTable = {key: configKey, header: [], data: []}

  const [configTable, setConfigTable] = useState<ConfigTable>(defaultConfigTable);

  const getColumns = (header: string[]): Column[] => [
    { columnId: " ", width: 50, resizable: true, },
    ...header.map(h => ({ columnId: h, width: 100, resizable: true, })),
  ]

  const [columns, setColumns] = useState<Column[]>(getColumns([]));

  useEffect(() => {
    if (configsState === undefined) return;
    setConfigTable(configsState.configs[configKey] ?? defaultConfigTable)
  }, [configsState, configKey])


  useEffect(() => {
    setColumns(getColumns(configTable.header))
  }, [configTable])



  const getTableRows = (table: ConfigTable): Row[] => {
    console.log('table:', table)
    return [
      getTableHeader(table.header),
      ...getTableBody(table)
    ]
  }

  const getTableHeader = (header: string []): Row => {
    return {
      rowId: "header",
      cells: [
        { type: "number", value: 1 },
        ...header.map<DefaultCellTypes>(h => ({ type: "header", text: h }))
      ]
    }
  }

  const getTableBody = (table: ConfigTable): Row [] => {
    return table.data.map<Row>((row, idx) => ({
      rowId: idx,
      cells: [
        { type: "number", value: idx+2, nonEditable: true},
        ...table.header.map<DefaultCellTypes>(h => ({ type: "text", text: row[h], nonEditable: true}))
      ]
    }))
  }

  const handleColumnResize = (ci: Id, width: number) => {
    setColumns((prevColumns) => {
      const columnIndex = prevColumns.findIndex(el => el.columnId === ci);
      const resizedColumn = prevColumns[columnIndex];
      prevColumns[columnIndex] = {...resizedColumn, width};
      return [...prevColumns];
    });
  }
  console.log('rows:', getTableRows(configTable))
  console.log('columns:', columns)
  return (
    <ReactGrid
      rows={getTableRows(configTable)}
      columns={columns}
      stickyTopRows={1}
      enableRangeSelection={true}
      onColumnResized={handleColumnResize}
    />
  )
}

export default ConfigGrid;

