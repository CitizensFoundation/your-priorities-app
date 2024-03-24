import ExcelJS from "exceljs";
import path from "path";
import fetch from "node-fetch";
import { Headers } from "node-fetch";
const PAIRWISE_API_HOST = process.env.PAIRWISE_API_HOST; // Your API host
const defaultAuthHeader = new Headers({
    "Content-Type": "application/json",
    Authorization: `Basic ${Buffer.from(`${process.env.PAIRWISE_USERNAME}:${process.env.PAIRWISE_PASSWORD}`).toString("base64")}`,
});
async function fetchChoices(questionId, utmSource) {
    try {
        const response = await fetch(`${PAIRWISE_API_HOST}/questions/${questionId}/choices?utm_source=${utmSource || ""}`, {
            method: "GET",
            headers: defaultAuthHeader,
        });
        if (!response.ok) {
            console.error(response.statusText);
            throw new Error("Fetching choices failed.");
        }
        const choices = (await response.json());
        return choices;
    }
    catch (error) {
        console.error("Error fetching choices:", error);
        throw error;
    }
}
async function fetchVotes(choiceId, utmSource) {
    try {
        let url = `${PAIRWISE_API_HOST}/choices/${choiceId}/votes?valid_record=true`;
        if (utmSource) {
            url += `&utm_source=${utmSource}`;
        }
        const response = await fetch(url, {
            method: "GET",
            headers: defaultAuthHeader,
        });
        if (!response.ok) {
            console.error(response.statusText);
            throw new Error("Fetching votes failed.");
        }
        const votes = (await response.json());
        return votes;
    }
    catch (error) {
        console.error("Error fetching votes:", error);
        throw error;
    }
}
export async function exportChoiceVotes(questionId, utmSource, outputFolder = "tmp") {
    console.log(`Exporting choice votes for question ${questionId} with utm_source ${utmSource}`);
    const choices = (await fetchChoices(questionId, utmSource));
    console.log(`Found ${choices.length} choices`);
    const workbook = new ExcelJS.Workbook();
    const choicesSheet = workbook.addWorksheet("Choices");
    const winningVotesSheet = workbook.addWorksheet("Winning Votes");
    const losingVotesSheet = workbook.addWorksheet("Losing Votes");
    // Setting the headers
    const choicesHeaders = [
        "Id",
        "Question Id",
        "Wins",
        "Losses",
        "Votes",
        "Score",
        "Data",
        "Elo Rating",
        "Seed",
    ];
    choicesSheet.addRow(choicesHeaders);
    const votesHeaders = [
        "Id",
        "Voter Id",
        "Question Id",
        "Prompt Id",
        "Choice Id",
        "Loser Choice Id",
        "Created At",
        "Updated At",
        "Time Viewed",
        "UTM Source",
        "UTM Campaign",
        "UTM Medium",
        "UTM Content",
    ];
    winningVotesSheet.addRow(votesHeaders);
    losingVotesSheet.addRow(votesHeaders);
    for (let choice of choices) {
        const votes = (await fetchVotes(choice.id, utmSource));
        const voteCount = choice.wins + choice.losses;
        choicesSheet.addRow([
            choice.id,
            choice.question_id,
            choice.wins,
            choice.losses,
            voteCount,
            choice.score,
            choice.data,
            "N/A",
            "N/A",
        ]);
        votes.winning_votes.forEach((vote) => {
            winningVotesSheet.addRow([
                vote.id,
                vote.voter_id,
                vote.question_id,
                vote.prompt_id,
                vote.choice_id,
                vote.loser_choice_id,
                vote.created_at,
                vote.updated_at,
                vote.time_viewed,
                vote.tracking.utmSource,
                vote.tracking.utmCampaign,
                vote.tracking.utmMedium,
                vote.tracking.utmContent,
            ]);
        });
        votes.losing_votes.forEach((vote) => {
            losingVotesSheet.addRow([
                vote.id,
                vote.voter_id,
                vote.question_id,
                vote.prompt_id,
                vote.choice_id,
                vote.loser_choice_id,
                vote.created_at,
                vote.updated_at,
                vote.time_viewed,
                vote.tracking.utmSource,
                vote.tracking.utmCampaign,
                vote.tracking.utmMedium,
                vote.tracking.utmContent,
            ]);
        });
    }
    // Saving the Excel file
    const filePath = path.join(outputFolder, "choice_votes.xlsx");
    await workbook.xlsx.writeFile(filePath);
    console.log(`Generated choice votes file at: ${filePath}`);
}
