import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getCurrentPeriodStatus, markFeePaid } from '../../../redux/feeRelated/feePaymentHandle';
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Checkbox,
    Box,
    Typography,
    TextField,
    MenuItem,
    Button
} from '@mui/material';
import { GreenButton } from '../../../components/buttonStyles';

const ClassFeeCollection = () => {
    const dispatch = useDispatch();
    const params = useParams();
    const classID = params.id;

    const { currentUser } = useSelector(state => state.user);
    const { currentPeriodStatus, loading } = useSelector(state => state.feePayment);

    const [selectedPeriod, setSelectedPeriod] = useState('');
    const [initialLoad, setInitialLoad] = useState(true);

    // Generate current period based on fee type
    const generateCurrentPeriod = (feeType) => {
        const now = new Date();
        const monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"];
        
        if (feeType === 'Monthly') {
            return `${monthNames[now.getMonth()]} ${now.getFullYear()}`;
        } else if (feeType === 'Quarterly') {
            const quarter = Math.floor(now.getMonth() / 3) + 1;
            return `Q${quarter} ${now.getFullYear()}`;
        } else if (feeType === 'Yearly') {
            return `${now.getFullYear()}`;
        } else {
            return 'One-time';
        }
    };

    // Initial load - fetch with a default period to check if fee exists
    useEffect(() => {
        if (initialLoad) {
            const defaultPeriod = generateCurrentPeriod('Monthly'); // Use any period for initial check
            dispatch(getCurrentPeriodStatus(classID, defaultPeriod));
            setInitialLoad(false);
        }
    }, [initialLoad, classID, dispatch]);

    // Set selected period once we have fee data
    useEffect(() => {
        if (currentPeriodStatus?.fee && !selectedPeriod) {
            const period = generateCurrentPeriod(currentPeriodStatus.fee.period);
            setSelectedPeriod(period);
        }
    }, [currentPeriodStatus, selectedPeriod]);

    // Fetch data when period changes (but not on initial load)
    useEffect(() => {
        if (selectedPeriod && !initialLoad) {
            dispatch(getCurrentPeriodStatus(classID, selectedPeriod));
        }
    }, [selectedPeriod]);

    const handleCheckboxChange = async (student) => {
        const fields = {
            studentId: student.studentId,
            classId: classID,
            feeId: currentPeriodStatus.fee._id,
            paymentPeriod: selectedPeriod,
            amountPaid: student.feeAmount,
            adminID: currentUser._id
        };

        await dispatch(markFeePaid(fields));
        // Refresh the data
        dispatch(getCurrentPeriodStatus(classID, selectedPeriod));
    };

    // Generate period options based on fee type
    const generatePeriodOptions = () => {
        if (!currentPeriodStatus?.fee) return [];
        
        const now = new Date();
        const options = [];
        const feeType = currentPeriodStatus.fee.period;

        if (feeType === 'Monthly') {
            const monthNames = ["January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"];
            // Show current month and previous 11 months
            for (let i = 0; i < 12; i++) {
                const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
                options.push(`${monthNames[date.getMonth()]} ${date.getFullYear()}`);
            }
        } else if (feeType === 'Quarterly') {
            // Show current quarter and previous 3 quarters
            for (let i = 0; i < 4; i++) {
                const quarterMonth = now.getMonth() - (i * 3);
                const date = new Date(now.getFullYear(), quarterMonth, 1);
                const quarter = Math.floor(date.getMonth() / 3) + 1;
                options.push(`Q${quarter} ${date.getFullYear()}`);
            }
        } else if (feeType === 'Yearly') {
            // Show current year and previous 2 years
            for (let i = 0; i < 3; i++) {
                options.push(`${now.getFullYear() - i}`);
            }
        } else {
            options.push('One-time');
        }

        return options;
    };

    if (!currentPeriodStatus || !currentPeriodStatus.fee) {
        return (
            <Box sx={{ padding: 3 }}>
                <Typography variant="h6" color="error">
                    No fee structure set for this class. Please set a fee first.
                </Typography>
            </Box>
        );
    }

    const paidCount = currentPeriodStatus.students?.filter(s => s.isPaid).length || 0;
    const totalStudents = currentPeriodStatus.students?.length || 0;
    const totalCollected = paidCount * (currentPeriodStatus.fee?.amount || 0);

    return (
        <Box sx={{ padding: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
                <Typography variant="h5">Fee Collection</Typography>
                <TextField
                    select
                    label="Select Period"
                    value={selectedPeriod}
                    onChange={(e) => setSelectedPeriod(e.target.value)}
                    sx={{ minWidth: 200 }}
                    size="small"
                >
                    {generatePeriodOptions().map((period) => (
                        <MenuItem key={period} value={period}>
                            {period}
                        </MenuItem>
                    ))}
                </TextField>
            </Box>

            <Box sx={{ marginBottom: 2, display: 'flex', gap: 3 }}>
                <Typography variant="body1">
                    <strong>Fee Amount:</strong> {currentPeriodStatus.fee.amount} / {currentPeriodStatus.fee.period}
                </Typography>
                <Typography variant="body1">
                    <strong>Paid:</strong> {paidCount} / {totalStudents} students
                </Typography>
                <Typography variant="body1">
                    <strong>Total Collected:</strong> {totalCollected}
                </Typography>
            </Box>

            {loading ? (
                <Typography>Loading...</Typography>
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell><strong>Roll No</strong></TableCell>
                                <TableCell><strong>Student Name</strong></TableCell>
                                <TableCell><strong>Fee Amount</strong></TableCell>
                                <TableCell align="center"><strong>Paid</strong></TableCell>
                                <TableCell><strong>Payment Date</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {currentPeriodStatus.students && currentPeriodStatus.students.map((student) => (
                                <TableRow key={student.studentId}>
                                    <TableCell>{student.rollNum}</TableCell>
                                    <TableCell>{student.studentName}</TableCell>
                                    <TableCell>{student.feeAmount}</TableCell>
                                    <TableCell align="center">
                                        <Checkbox
                                            checked={student.isPaid}
                                            onChange={() => handleCheckboxChange(student)}
                                            color="success"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        {student.paidDate 
                                            ? new Date(student.paidDate).toLocaleDateString()
                                            : '-'}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Box>
    );
};

export default ClassFeeCollection;
