import React, { useState } from 'react';
import styled from 'styled-components';
import { CSVLink } from 'react-csv';

// Example JSON data
import { data } from './makeData';

const ExpandedRowContent = styled.div`
padding: 20px;
  background: linear-gradient(135deg, #333, #444);
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  margin-top: 20px;
  text-align: center;
  color: #fff;
`;

const ExpandedRowText = styled.div`
  font-size: 20px;
  margin-bottom: 24px;

  strong {
    color: #f39c12;
  }

  div {
    margin-bottom: 16px;
  }
`;

const TableContainer = styled.div`
  text-align: center;
  font-family: 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue';
  width: 100%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 13px;
  overflow: hidden;
  transition: box-shadow 0.3s ease;
  background: linear-gradient(to bottom, #ffffff, #f0f0f0); 

  &:hover {
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  }
`;

const Table = styled.table`
text-align: center;
font-family: 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue';
width: 100%;
border-collapse: separate;
border-spacing: 0;
box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
color: #333;
border: 1px solid #ddd;
border-radius: 12px;
background: linear-gradient(to bottom, #f8f9fa, #e2e6ea); 

th,
td {
  padding: 12px;
  border: 1px solid #ddd;
  position: relative;
  font-size: 18px; /* Adjusted font size */
  font-weight: 600; /* Adjusted font weight */
  color: #312D2D; /* Table text color */
}

th {
  background-color: #205476;
  cursor: pointer;
  font-weight: bold;
  border-radius: 8px;
  transition: background-color 0.3s ease, color 0.3s ease;
  color: #ffffff;

  &:hover {
    background-color: #2c3e50;
  }
}

td {
  background-color: #fff; /* Table cell background color */
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #f2f2f2;
  }
}

tr:hover td {
  background-color: #f9f9f9;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
`;

const TableHeader = styled.th`
  text-align: center;
  background-color: #205476;
  padding: 12px;
  text-align: center;
  cursor: pointer;
  font-family: 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 
  'Fira Sans', 'Droid Sans', 'Helvetica Neue';
  color: #ffffff;
  border: 1px solid #2980b9;
  border-top: 3px solid #2980b9;
  border-radius: 8px 8px 0 0;
  transition: background-color 0.3s ease, color 0.3s ease;

  &:hover {
    background-color: #2c3e50;
  }

  &.ascending {
    background-color: #2980b9;
  }

  &.descending {
    background-color: #c0392b;
  }

  &.descending.ascending {
    background-color: #e74c3c;
  }

  background: linear-gradient(to bottom, #205476, #143655);
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
`;

const TableCell = styled.td`
  text-align: center;
  padding: 12px;
  border-radius: 8px;
  font-family: 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue';
  color: #333;
  border: 1px solid #ddd;
  background: linear-gradient(to bottom, #f5f5f5, #e0e0e0);
  transition: background 0.3s ease, transform 0.2s ease;

  &:hover {
    background-color: #d4d4d4;
    transform: scale(1.02);
  }
`;

const PerHourCell = styled.td`
  text-align: center;
  padding: 12px;
  border-radius: 8px;
  font: black;
  font-family: 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 
  'Fira Sans', 'Droid Sans', 'Helvetica Neue';
  color: #555;
  border: 1px solid #ddd;
  background: linear-gradient(to bottom, #f0f0f0, #e0e0e0);
  transition: background 0.3s ease;

  span {
    background-color: ${({ phc }) =>
        phc < 20 ? 'rgb(198, 40, 40)' 
        : phc >= 20 && 
        phc < 22 ? 'rgb(27, 94, 32)' :
         'rgb(230, 81, 0)'};
    color: #fff;
    border-radius: 4px;
    padding: 3px 6px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  &:hover {
    background: linear-gradient(to bottom, #ececec, #dbdbdb);
  }
`;

const TableRow = styled.tr`
  background-color: #f8f9fa;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    background-color: #e2e6ea;
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
  }

  &::after {
    content: '';
    display: block;
    width: 100%;
    height: 2px;
    background: linear-gradient(to right, transparent, #ced4da, transparent);
    position: absolute;
    bottom: 0;
    left: 0;
  }
`;


const FilterInput = styled.input`
  padding: 10px;
  border: 1px solid #ced4da;
  border-radius: 6px;
  font-size: 16px; 
  
  transition: border-color 0.3s ease;

  &:focus {
    border-color: #4caf50;
  }
`;

const ExportButton = styled(CSVLink)`
  background-color: #4caf50;
  font-family: 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 
  'Fira Sans', 'Droid Sans', 'Helvetica Neue';
  border: none;
  font-weight: bold;
  color: white;
  padding: 12px 20px;
  position: relative;
  text-align: center;
  text-decoration: none;
  font-size: 20px;
  cursor: pointer;
  border-radius: px;
  margin-right: 10px;
  outline-offset: 4px;
  transition: background-color 0.3s ease, transform 0.3s ease, 
  box-shadow 0.3s ease, color 0.3s ease;

  &:hover {
    background-color: #45a049;
    color: #ffffff; 
    transform: translateY(-4px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.5); 
  }

  &:active {
    transform: translateY(1px);
  }

  &:before {
    content: "";
    position: absolute;
    top: 4px;
    left: 4px;
    right: -4px;
    bottom: -4px;
    border-radius: 8px;
    background: linear-gradient(135deg, #4caf50, #45a049);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

//   &:hover:before {
//     opacity: 1;
//   }

//   &:focus {
//     outline: none;
//   }
// `;

const TableCheckbox = styled.input`
appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  height: 24px;
  width: 24px;
  border: 2px solid #4caf50;
  border-radius: 4px;
  outline: none;
  cursor: pointer;
  position: relative;
  transition: background-color 0.3s, border-color 0.3s;

  &:checked {
    background-color: #4caf50;
    border: 2px solid #4caf50;
  }

  &:checked:after {
    content: '\u2714';
    font-size: 16px;
    color: #fff;
    font-weight: bold;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  &:hover {
    background-color: #5A5151;
    border-color: #333;
  }
`;


const ExpandCollapseButton = styled.span`
  cursor: pointer;
  user-select: none;
  font-size: 20px; 
  transition: color 0.3s ease;

  &:hover {
    color: #4caf50;
  }
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;


const PageNumberList = styled.ul`
  list-style: none;
  display: flex;
  padding: 0;
`;

const PageNumberButton = styled.button`
  margin: 0 5px;
  padding: 8px 12px;
  background-color: #4caf50;
  border: none;
  color: white;
  font-size: 16px;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #45a049;
  }

  &:focus {
    outline: none;
  }

  ${({ isActive }) =>
        isActive &&
        `
    background-color: #45a049;
  `}
`;

const Ellipsis = styled.span`
  margin: 0 5px;
`;



const Example = () => {
    const [tableData, setTableData] = useState(data);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
    const [filters, setFilters] = useState({
        full_name: '',
        pdesc: '',
        pskill: '',
        sskill: '',
        pexp: '',
        fexp: '',
        phcharge: '',
        avail_name: '',
        del_name: '',
    });
    const [selectedRows, setSelectedRows] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);

    const handleSort = (key) => {
        let direction = 'ascending';

        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }

        setSortConfig({ key, direction });
        applySort(key, direction);
    };

    const applySort = (key, direction) => {
        const sortedData = [...tableData].sort((a, b) => {
            const aValue = a[key];
            const bValue = b[key];

            if (direction === 'ascending') {
                return aValue.localeCompare ? aValue.localeCompare(bValue) : aValue - bValue;
            } else {
                return bValue.localeCompare ? bValue.localeCompare(aValue) : bValue - aValue;
            }
        });

        setTableData(sortedData);
    };

    const handleFilterChange = (key, value) => {
        setFilters((prevFilters) => ({ ...prevFilters, [key]: value }));
    };

    const applyFilters = () => {
        const filteredData = data.filter((row) => {
            const nameMatch = row.full_name.toLowerCase().includes(filters.full_name.toLowerCase());
            const descMatch = row.pdesc.toLowerCase().includes(filters.pdesc.toLowerCase());
            const pskillMatch = row.pskill.toLowerCase().includes(filters.pskill.toLowerCase());
            const sskillMatch = row.sskill.toLowerCase().includes(filters.sskill.toLowerCase());
            const pexpMatch = row.pexp.toString().includes(filters.pexp);
            const fexpMatch = row.fexp.toString().includes(filters.fexp);
            const phchargeMatch = row.phcharge.toString().includes(filters.phcharge);
            const availMatch = row.avail_name.toLowerCase().includes(filters.avail_name.toLowerCase());
            const delMatch = row.del_name.toLowerCase().includes(filters.del_name.toLowerCase());

            return (
                nameMatch &&
                descMatch &&
                pskillMatch &&
                sskillMatch &&
                pexpMatch &&
                fexpMatch &&
                phchargeMatch &&
                availMatch &&
                delMatch
            );
        });

        setTableData(filteredData);
    };

    const csvData = tableData.map((row) => ({
        'Full Name': row.full_name,
        'Professional Description': row.pdesc,
        'Primary Skill': row.pskill,
        'Secondary Skill': row.sskill,
        'Professional Experience': row.pexp,
        'Freelancing Experience': row.fexp,
        'Per Hour Charge': `$${row.phcharge}`,
        'Availability': row.avail_name,
        'Delivery Mode': row.del_name,
    }));

    const handleSelectAll = () => {
        if (selectedRows.length === tableData.length) {
            setSelectedRows([]);
        } else {
            setSelectedRows(tableData.map((row) => row.id));
        }
    };

    const handleSelectRow = (userSlug) => {
        if (selectedRows.includes(userSlug)) {
          setSelectedRows(selectedRows.filter((slug) => slug !== userSlug));
        } else {
          setSelectedRows([...selectedRows, userSlug]);
        }
      };
      

    const isRowSelected = (userSlug) => selectedRows.includes(userSlug);

    const handleExpandCollapse = (userSlug) => {
        // Logic to toggle the collapse state for a specific row
    };
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = tableData.slice(indexOfFirstItem, indexOfLastItem);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };
    return (
        <TableContainer>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <ExportButton data={csvData} filename={'table_data.csv'}>
                    Export as CSV
                </ExportButton>
            </div>
            <Table>
                <thead>
                    <tr>
                        <TableHeader>
                            <TableCheckbox
                                type="checkbox"
                                checked={selectedRows.length === tableData.length}
                                onChange={handleSelectAll}
                            />
                        </TableHeader>
                        <TableHeader
                            className={sortConfig.key === 'full_name' ? sortConfig.direction : ''}
                            onClick={() => handleSort('full_name')}
                        >
                            Full Name {renderSortIndicator('full_name', sortConfig)}
                        </TableHeader>
                        <TableHeader
                            className={sortConfig.key === 'pskill' ? sortConfig.direction : ''}
                            onClick={() => handleSort('pskill')}
                        >
                            Primary Skill {renderSortIndicator('pskill', sortConfig)}
                        </TableHeader>
                        <TableHeader
                            className={sortConfig.key === 'sskill' ? sortConfig.direction : ''}
                            onClick={() => handleSort('sskill')}
                        >
                            Secondary Skill {renderSortIndicator('sskill', sortConfig)}
                        </TableHeader>
                        <TableHeader
                            className={sortConfig.key === 'pexp' ? sortConfig.direction : ''}
                            onClick={() => handleSort('pexp')}
                        >
                            Professional Experience {renderSortIndicator('pexp', sortConfig)}
                        </TableHeader>
                        <TableHeader
                            className={sortConfig.key === 'fexp' ? sortConfig.direction : ''}
                            onClick={() => handleSort('fexp')}
                        >
                            Freelancing Experience {renderSortIndicator('fexp', sortConfig)}
                        </TableHeader>
                        <TableHeader
                            className={sortConfig.key === 'phcharge' ? sortConfig.direction : ''}
                            onClick={() => handleSort('phcharge')}
                        >
                            Per Hour Charge {renderSortIndicator('phcharge', sortConfig)}
                        </TableHeader>
                        <TableHeader
                            className={sortConfig.key === 'avail_name' ? sortConfig.direction : ''}
                            onClick={() => handleSort('avail_name')}
                        >
                            Availability {renderSortIndicator('avail_name', sortConfig)}
                        </TableHeader>
                        <TableHeader
                            className={sortConfig.key === 'del_name' ? sortConfig.direction : ''}
                            onClick={() => handleSort('del_name')}
                        >
                            Delivery Mode {renderSortIndicator('del_name', sortConfig)}
                        </TableHeader>
                    </tr>
                    <tr>
                        <TableHeader>
                            {/* Select All checkbox */}
                        </TableHeader>
                        <TableHeader>
                            <FilterInput
                                type="text"
                                placeholder="Filter Full Name"
                                value={filters.full_name}
                                onChange={(e) => handleFilterChange('full_name', e.target.value)}
                                onBlur={applyFilters}
                            />
                        </TableHeader>
                        <TableHeader>
                            <FilterInput
                                type="text"
                                placeholder="Filter Primary Skill"
                                value={filters.pskill}
                                onChange={(e) => handleFilterChange('pskill', e.target.value)}
                                onBlur={applyFilters}
                            />
                        </TableHeader>
                        <TableHeader>
                            <FilterInput
                                type="text"
                                placeholder="Filter Secondary Skill"
                                value={filters.sskill}
                                onChange={(e) => handleFilterChange('sskill', e.target.value)}
                                onBlur={applyFilters}
                            />
                        </TableHeader>
                        <TableHeader>
                            <FilterInput
                                type="text"
                                placeholder="Filter Professional Experience"
                                value={filters.pexp}
                                onChange={(e) => handleFilterChange('pexp', e.target.value)}
                                onBlur={applyFilters}
                            />
                        </TableHeader>
                        <TableHeader>
                            <FilterInput
                                type="text"
                                placeholder="Filter Freelancing Experience"
                                value={filters.fexp}
                                onChange={(e) => handleFilterChange('fexp', e.target.value)}
                                onBlur={applyFilters}
                            />
                        </TableHeader>
                        <TableHeader>
                            <FilterInput
                                type="text"
                                placeholder="Filter Per Hour Charge"
                                value={filters.phcharge}
                                onChange={(e) => handleFilterChange('phcharge', e.target.value)}
                                onBlur={applyFilters}
                            />
                        </TableHeader>
                        <TableHeader>
                            <FilterInput
                                type="text"
                                placeholder="Filter Availability"
                                value={filters.avail_name}
                                onChange={(e) => handleFilterChange('avail_name', e.target.value)}
                                onBlur={applyFilters}
                            />
                        </TableHeader>
                        <TableHeader>
                            <FilterInput
                                type="text"
                                placeholder="Filter Delivery Mode"
                                value={filters.del_name}
                                onChange={(e) => handleFilterChange('del_name', e.target.value)}
                                onBlur={applyFilters}
                            />
                        </TableHeader>
                    </tr>
                </thead>
                <tbody>
                    {currentItems.map((row) => (
                        <React.Fragment key={row.id}>

                            <TableRow>
                                <TableCell>
                                    <ExpandCollapseButton onClick={() => handleSelectRow(row.id)}>
                                    
                                        {isRowSelected(row.id) ? '▼' : '▶'}
                                    </ExpandCollapseButton>
                                    <TableCheckbox
                                        type="checkbox"
                                        onChange={() => handleSelectRow(row.id)}
                                    />
                                </TableCell>
                                <TableCell>{row.full_name}</TableCell>
                                <TableCell>{row.pskill}</TableCell>
                                <TableCell>{row.sskill}</TableCell>
                                <TableCell>{row.pexp}</TableCell>
                                <TableCell>{row.fexp}</TableCell>
                                {/* <TableCell>${row.phcharge}</TableCell> */}
                                <PerHourCell phc={row.phcharge}>
                                    <span>
                                        ${row.phcharge}
                                    </span>
                                </PerHourCell>

                                <TableCell>{row.avail_name}</TableCell>
                                <TableCell>{row.del_name}</TableCell>
                            </TableRow>
                            {isRowSelected(row.id) && (
                                <tr>
                                    <td colSpan="10">
                                    
                                        <ExpandedRowContent>
                                            <ExpandedRowText>
                                                <div>
                                                    <strong>Name:</strong> {row.full_name}
                                                </div>
                                                <div>
                                                    <strong>Primary Skill:</strong> {row.pskill}
                                                </div>
                                                <div>
                                                    <strong>Secondary Skill:</strong> {row.sskill}
                                                </div>
                                                <div>
                                                    <strong>Professional Experience:</strong> {row.pexp}
                                                </div>
                                                <div>
                                                    <strong>Freelancing Experience:</strong> {row.fexp}
                                                </div>
                                            </ExpandedRowText>
                                        </ExpandedRowContent>
                                        <div style={{ padding: '10px', backgroundColor: '#f2f2f2', color: '#CA2C64' }}>
                                            Content for {row.full_name}
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </React.Fragment>
                    ))}
                </tbody>
            </Table>
            <PaginationContainer>
                <PageNumberList>
                    {Array.from({ length: Math.ceil(tableData.length / itemsPerPage) }, (_, index) => index + 1).map((number) => (
                        <li key={number}>
                            <PageNumberButton
                                onClick={() => handlePageChange(number)}
                                isActive={number === currentPage}
                            >
                                {number}
                            </PageNumberButton>
                        </li>
                    ))}
                </PageNumberList>
            </PaginationContainer>
        </TableContainer>
    );
};

const renderSortIndicator = (key, sortConfig) => {
    return (
        <>
            {key === sortConfig.key && sortConfig.direction === 'ascending' && '↑'}
            {key === sortConfig.key && sortConfig.direction === 'descending' && '↓'}
        </>
    );
};

export default Example;
