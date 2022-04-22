import { useTable, useSortBy } from 'react-table';
import React from 'react';
import { FaAngleLeft, FaAngleRight } from "react-icons/fa"

export default function OneCampusMobileTable(props) {

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns: props.columns, data: props.data, disableSortRemove: false }, useSortBy)
  //disableSortRemove: true => If true, the un-sorted state will not be available to multi-sorted columns.
  //#8FD4D8
  return (
    <table {...getTableProps()} style={{borderWidth: 0, borderColor: 'white', borderStyle: 'solid', width: '100%', background: '#9fcecb', borderRadius: '10px' }}>
      <thead style={{display: 'none' }}>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()} >
            {headerGroup.headers.map(column => (
              <th
              {...column.getHeaderProps(column.getSortByToggleProps())}
                style={{
                  borderBottom: 'solid 0px red',
                  background: 'transparent',
                  padding: 10,
                  color: '#394867',
                  textAlign: 'center',
                  fontWeight: 'bold',
                  
                }}
              >
                {column.render('Header')}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row, rowIndex) => {
          let rowLength = rows.length;
          prepareRow(row);
          if(rowIndex == rowLength - 1){
            let cellLength = row.cells.length;
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell, cellIndex) => {
                  return (
                    <td 
                      {...cell.getCellProps()}
                      style={{
                        padding: '0px',
                        borderBottom: 'solid 1px #e0e0e0',
                        borderBottomRightRadius: (cellIndex==cellLength-1)?0:0,
                        borderBottomLeftRadius: (cellIndex==0)?0:0,
                        background: (row.index%2==0)?'white':'#F0F5F4',
                        color: (cellIndex==3)?'#4F4F4F':'#4F4F4F',
                        fontWeight: (cellIndex==3)?'400':'400',
                        textAlign: 'center',
                      }}
                    >
                      {cell.render('Cell')}
                    </td>
                  )
                })}
              </tr>
            )

          }else{

            if(rowIndex == 0){
                let cellLength = row.cells.length;
                return (
                    <tr {...row.getRowProps()}>
                      {row.cells.map((cell, cellIndex) => {
                        return (
                          <td 
                            {...cell.getCellProps()}
                            style={{
                              padding: '0px',
                              borderTop: 'solid 1px #e0e0e0',
                              borderTopRightRadius: (cellIndex==cellLength-1)?0:0,
                              borderTopLeftRadius: (cellIndex==0)?0:0,
                              background: (row.index%2==0)?'white':'#F0F5F4',
                              color: (cellIndex==3)?'#4F4F4F':'#4F4F4F',
                              fontWeight: (cellIndex==3)?'400':'400',
                              textAlign: 'center',
                            }}
                          >
                            {cell.render('Cell')}
                          </td>
                        )
                      })}
                    </tr>
                  )

            }else{
                return (
                    <tr {...row.getRowProps()}>
                      {row.cells.map((cell, cellIndex) => {
                        return (
                          <td 
                            {...cell.getCellProps()}
                            style={{
                              padding: '0px',
                              border: 'solid 0px gray',
                              background: (row.index%2==0)?'white':'#F0F5F4',
                              color: (cellIndex==3)?'#4F4F4F':'#4F4F4F',
                              fontWeight: (cellIndex==3)?'400':'400',
                              textAlign: 'center',
                            }}
                          >
                            {cell.render('Cell')}
                          </td>
                        )
                      })}
                    </tr>
                  )
            }

          }
          
        })}
      </tbody>
    </table>
  )
}

