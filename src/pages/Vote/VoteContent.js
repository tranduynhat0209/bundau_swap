import {
  Box,
  Button,
  CircularProgress,
  Collapse,
  Divider,
  Grid,
} from "@material-ui/core";
import React, { Fragment, useCallback, useState } from "react";
import PaperContainer from "src/components/PaperContainer";
import { useVoteContext } from "src/context/vote-context";
import { useWeb3Connect } from "src/web3/web3-connect";
import { getContractAddress } from "src/web3/web3-contract/addresses";
import VoteABI from "src/web3/web3-contract/abis/Vote.json";
import useNotifier from "src/hooks/use-notifier";
import { useContractSender } from "src/web3/web3-contract/hooks/use-contract";

const Status = (props) => {
  const { status, ...others } = props;
  const colors = [
    ["Pending", "#d5f7f3"],
    ["Active", "#d5f7f3"],
    ["Canceled", "#ffc1bd"],
    ["Defeated", "#ffc1bd"],
    ["Succeeded", "#b8ffbb"],
    ["Queued", "#b8ffbb"],
    ["Expired", "#ffc1bd"],
    ["Executed", "#b8ffbb"],
  ];

  return (
    <Box
      sx={{
        backgroundColor: colors[status][1],
        borderRadius: "5px",
        padding: "5px 10px",
      }}
      {...others}
    >
      <h4
        style={{
          color: "black",
        }}
      >
        {colors[status][0]}
      </h4>
    </Box>
  );
};
const Progress = (props) => {
  const { voteFor, percent } = props;
  return (
    <Box display="flex" alignItems="center" width="70%">
      <h3
        style={{
          width: "70px",
        }}
      >
        {voteFor ? "For:" : "Against:"}
      </h3>
      <Box height="10px" width="50%" borderRadius="5px" bgcolor="#d5ded8">
        <Box
          height="10px"
          width={percent + "%"}
          borderRadius="5px"
          bgcolor={voteFor ? "green" : "red"}
        ></Box>
      </Box>
      <h3
        style={{
          marginLeft: "15px",
        }}
      >
        {percent + "%"}
      </h3>
    </Box>
  );
};

export default function VoteContent() {
  const { notifySuccess, notifyError } = useNotifier();
  const { proposals, totalBND, BNDBalance } = useVoteContext();
  const { address, chain } = useWeb3Connect();
  const voteAddress = getContractAddress(chain.chainId, "vote");
  const voteSender = useContractSender(VoteABI, voteAddress);
  const calPercent = (value) => {
    if (value && totalBND && totalBND > 0)
      return Math.round((value * 100) / totalBND);
    return 0;
  };
  const [open, setOpen] = useState(-1);
  const [sending, setSending] = useState(-1);
  const castVote = useCallback(
    async (id, support) => {
      setSending(id);
      try {
        await voteSender.methods.castVote(id, support).send({ from: address });
        notifySuccess("Cast vote successfully");
      } catch (err) {
        notifyError("Cast vote failed: " + err.message);
      }
      setSending(-1);
    },
    [voteSender]
  );

  return (
    <Fragment>
      <h1>Proposals List</h1>
      {proposals &&
        proposals.length > 0 &&
        proposals.map((proposal, index) => (
          <Box>
            <PaperContainer
              style={{
                marginTop: "15px",
              }}
            >
              <Grid container spacing={2}>
                <Grid item md={6} xs={12}>
                  <Box>
                    <Box display="flex">
                      <h2>Proposal ID: {proposal[0]} </h2>
                      <Status status={proposal.state} marginLeft="20px" />
                    </Box>
                    <p
                      style={{
                        fontSize: "large",
                        marginTop: "5px",
                      }}
                    >
                      <b>Start block:</b> {proposal[3]}
                    </p>
                    <p
                      style={{
                        fontSize: "large",
                        marginTop: "5px",
                      }}
                    >
                      <b>End block:</b> {proposal[4]}
                    </p>
                    <p
                      style={{
                        fontSize: "large",
                        marginTop: "5px",
                      }}
                    >
                      <b>Your voting power:</b> {calPercent(BNDBalance) + "%"}
                    </p>
                  </Box>
                </Grid>
                <Grid item md={4} xs={12}>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    width="100%"
                  >
                    <Progress
                      voteFor={true}
                      percent={calPercent(proposal[5])}
                    />
                    <Button
                      style={{
                        marginLeft: "10px",
                        color: "green",
                        fontSize: "large",
                      }}
                      disabled={
                        proposal.state !== "1" ||
                        sending === proposal[0] ||
                        proposal.receipt?.hasVoted === true
                      }
                      onClick={() => castVote(proposal[0], true)}
                    >
                      <b>
                        {sending === proposal[0] ? (
                          <CircularProgress sx={{ width: "30px" }} />
                        ) : (
                          "Vote For"
                        )}
                      </b>
                    </Button>
                  </Box>
                  <Box
                    display="flex"
                    marginTop="10px"
                    justifyContent="space-between"
                    width="100%"
                  >
                    <Progress
                      voteFor={false}
                      percent={calPercent(proposal[6])}
                    />
                    <Button
                      style={{
                        color: "red",
                        fontSize: "large",
                      }}
                      disabled={
                        proposal.state !== "1" ||
                        sending === proposal[0] ||
                        proposal.receipt?.hasVoted === true
                      }
                      onClick={() => castVote(proposal[0], false)}
                    >
                      <b>
                        {sending === proposal[0] ? (
                          <CircularProgress sx={{ width: "30px" }} />
                        ) : (
                          "Vote Against"
                        )}
                      </b>
                    </Button>
                  </Box>
                  <p
                    style={{
                      fontSize: "large",
                      marginTop: "5px",
                    }}
                  >
                    {proposal.receipt?.support ? (
                      <b
                        style={{
                          color: "green",
                        }}
                      >
                        You have supported this proposal
                      </b>
                    ) : proposal.receipt?.hasVoted ? (
                      <b
                        style={{
                          color: "red",
                        }}
                      >
                        You have rejected this proposal
                      </b>
                    ) : (
                      <b>You haven't submitted your vote</b>
                    )}
                  </p>
                </Grid>
                <Grid item md={2} xs={12}>
                  <Box
                    width="100%"
                    height="100%"
                    justifyContent="center"
                    alignItems="center"
                    display="flex"
                    onClick={() => setOpen(open === index ? -1 : index)}
                  >
                    <p
                      style={{
                        textDecorationLine: "underline",
                        fontSize: "large",
                        cursor: "pointer",
                      }}
                    >
                      {open === index ? "See less" : "See more"}
                    </p>
                  </Box>
                </Grid>
              </Grid>
              <Collapse in={open === index} unmountOnExit>
                <Divider variant="middle" style={{ margin: "15px 0px" }} />
                {proposal.actions.map((action) => (
                  <Box display="flex" alignItems="center" marginTop="15px">
                    <h3>Pool: </h3>
                    <img
                      src={action.token0Img}
                      style={{
                        width: "30px",
                        height: "30px",
                        marginLeft: "20px",
                      }}
                    />
                    <img
                      src={action.token1Img}
                      style={{
                        width: "30px",
                        height: "30px",
                      }}
                    />
                    <h3>
                      {action.token0Symbol}/{action.token1Symbol}
                    </h3>
                    <Box width="20%" />
                    <h3>Set Swap Fee: {action.fee / 10}%</h3>
                  </Box>
                ))}
              </Collapse>
            </PaperContainer>
          </Box>
        ))}
    </Fragment>
  );
}
