import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllFees, deleteFee } from '../../../redux/feeRelated/feeHandle';
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    Box,
    Typography,
    IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import { BlueButton, GreenButton } from '../../../components/buttonStyles';

const ShowFees = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { currentUser } = useSelector(state => state.user);
    const { feesList, loading, error, response } = useSelector(state => state.fee);

    useEffect(() => {
        dispatch(getAllFees(currentUser._id));
    }, [currentUser._id, dispatch]);

    const handleDelete = (feeId) => {
        dispatch(deleteFee(feeId));
        dispatch(getAllFees(currentUser._id));
    };

    return (
        <Box sx={{ padding: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                <Typography variant="h4">Class Fees</Typography>
                <GreenButton
                    variant="contained"
                    onClick={() => navigate('/Admin/fees/set')}
                >
                    Set Class Fee
                </GreenButton>
            </Box>

            {loading ? (
                <Typography>Loading...</Typography>
            ) : response ? (
                <Box sx={{ textAlign: 'center', marginTop: 4 }}>
                    <Typography variant="h6">{response}</Typography>
                    <GreenButton
                        variant="contained"
                        onClick={() => navigate('/Admin/fees/set')}
                        sx={{ marginTop: 2 }}
                    >
                        Set First Fee
                    </GreenButton>
                </Box>
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell><strong>Class Name</strong></TableCell>
                                <TableCell><strong>Fee Amount</strong></TableCell>
                                <TableCell><strong>Period</strong></TableCell>
                                <TableCell align="center"><strong>Actions</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {feesList && feesList.map((fee) => (
                                <TableRow key={fee._id}>
                                    <TableCell>{fee.sclass?.sclassName || 'N/A'}</TableCell>
                                    <TableCell>{fee.amount}</TableCell>
                                    <TableCell>{fee.period}</TableCell>
                                    <TableCell align="center">
                                        <IconButton
                                            onClick={() => handleDelete(fee._id)}
                                            color="error"
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                        <BlueButton
                                            variant="contained"
                                            size="small"
                                            onClick={() => navigate(`/Admin/fees/set/${fee.sclass._id}`)}
                                        >
                                            Edit
                                        </BlueButton>
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

export default ShowFees;
