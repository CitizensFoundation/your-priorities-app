import ExcelJS from "exceljs";
import fetch from "node-fetch";
import { Headers } from "node-fetch";
import { v4 as uuidv4 } from "uuid";
import models from "../../../models/index.cjs";
import { setJobError, updateUploadJobStatus, uploadToS3, } from "./commonUtils.js";
const dbModels = models;
const Image = dbModels.Image;
const PAIRWISE_API_HOST = process.env.PAIRWISE_API_HOST; // Your API host
const defaultAuthHeader = new Headers({
    "Content-Type": "application/json",
    Authorization: `Basic ${Buffer.from(`${process.env.PAIRWISE_USERNAME}:${process.env.PAIRWISE_PASSWORD}`).toString("base64")}`,
});
async function fetchChoices(questionId, utmSource) {
    try {
        const url = `${PAIRWISE_API_HOST}/questions/${questionId}/choices.json?include_inactive=true&show_all=true${utmSource ? `?utm_source=${utmSource}` : ""}`;
        const response = await fetch(url, {
            method: "GET",
            headers: defaultAuthHeader,
        });
        console.log(url);
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
async function fetchVotes(questionId, choiceId, utmSource) {
    try {
        let url = `${PAIRWISE_API_HOST}/questions/${questionId}/choices/${choiceId}/show_votes.json`;
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
function calculateElo(rating1, rating2, score1, score2) {
    const kFactor = 32;
    const expected1 = 1.0 / (1 + Math.pow(10, (rating2 - rating1) / 400.0));
    const expected2 = 1.0 / (1 + Math.pow(10, (rating1 - rating2) / 400.0));
    const newRating1 = rating1 + kFactor * (score1 - expected1);
    const newRating2 = rating2 + kFactor * (score2 - expected2);
    return [newRating1, newRating2];
}
export async function exportChoiceVotes(workPackage, done) {
    try {
        await updateUploadJobStatus(workPackage.jobId, 5);
        console.log(`Exporting choice votes for question ${workPackage.questionId} with utm_source ${workPackage.utmSource}`);
        const choices = (await fetchChoices(workPackage.questionId, workPackage.utmSource));
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
        const choiceVoteMap = new Map();
        for (let i = 0; i < choices.length; i++) {
            const choice = choices[i];
            const votes = (await fetchVotes(workPackage.questionId, choice.id, workPackage.utmSource));
            choiceVoteMap.set(choice.id, votes);
            const voteCount = choice.wins + choice.losses;
            let data = choice.data;
            try {
                const jsonData = JSON.parse(choice.data);
                debugger;
                if (jsonData && jsonData.content) {
                    data = jsonData.content;
                }
            }
            catch (error) {
            }
            choicesSheet.addRow([
                choice.id,
                workPackage.questionId,
                choice.wins,
                choice.losses,
                voteCount,
                Math.round(choice.score),
                data,
                "N/A",
                choice.user_created ? "User" : "Seed",
            ]);
            votes.winning_votes.forEach((vote) => {
                console.log(`${vote.tracking ? JSON.stringify(vote.tracking) : ""}`);
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
                    vote.tracking.utm_source,
                    vote.tracking.utm_campaign,
                    vote.tracking.utm_medium,
                    vote.tracking.utm_content,
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
                    vote.tracking.utm_source,
                    vote.tracking.utm_campaign,
                    vote.tracking.utm_medium,
                    vote.tracking.utm_content,
                ]);
            });
            const progress = Math.round((i / choices.length) * 95); // Scale to 95% maximum to leave room for final steps
            await updateUploadJobStatus(workPackage.jobId, progress);
        }
        const eloRatings = new Map();
        choices.forEach(choice => {
            eloRatings.set(choice.id, 1000); // Default ELO rating
        });
        // NowvotesMap, iterate over choices to compute ELO ratings without fetching votes again
        choices.forEach(choice1 => {
            choices.forEach(choice2 => {
                if (choice1.id === choice2.id)
                    return; // Skip comparison with itself
                // Assuming votesMap is a Map where each entry's key is a choice ID
                // and its value is an object with winning_votes and losing_votes arrays
                const votes1 = choiceVoteMap.get(choice1.id);
                const votes2 = choiceVoteMap.get(choice2.id);
                const directVotes1 = votes1?.winning_votes.filter(vote => vote.loser_choice_id === choice2.id) || [];
                const directVotes2 = votes2?.winning_votes.filter(vote => vote.loser_choice_id === choice1.id) || [];
                if (directVotes1.length === 0 && directVotes2.length === 0)
                    return;
                const score1 = directVotes1.length / (directVotes1.length + directVotes2.length);
                const score2 = directVotes2.length / (directVotes2.length + directVotes1.length);
                const currentRating1 = eloRatings.get(choice1.id) || 1500;
                const currentRating2 = eloRatings.get(choice2.id) || 1500;
                const [newRating1, newRating2] = calculateElo(currentRating1, currentRating2, score1, score2);
                eloRatings.set(choice1.id, newRating1);
                eloRatings.set(choice2.id, newRating2);
            });
        });
        // After the ELO ratings are computed
        choices.forEach((choice, i) => {
            const eloRating = eloRatings.get(choice.id);
            // Update the Excel sheet with the new ELO rating
            // Note: Adjust the cell reference as needed
            if (eloRating) {
                choicesSheet.getCell(`H${i + 2}`).value = Math.round(eloRating);
                console.log(`Choice ${choice.id} has elo rating ${Math.round(eloRating)}`);
            }
            else {
                console.error(`Choice ${choice.id} has no elo rating`);
            }
        });
        // Generate and upload the workbook to S3
        const buffer = await workbook.xlsx.writeBuffer();
        const filename = `choice_votes_${uuidv4()}.xlsx`;
        console.log(`Uploading choice votes to S3: ${filename}`);
        uploadToS3(workPackage.jobId, `${workPackage.userId}`, filename, workPackage.exportType, buffer, async (error, url) => {
            if (error) {
                console.error("Error uploading choice votes to S3:", error);
                done(error, url);
            }
            else {
                console.log(`Uploaded choice votes to S3: ${url}`);
                await updateUploadJobStatus(workPackage.jobId, 100, {
                    reportUrl: url,
                });
                done(undefined, url);
            }
        });
        console.log(`Successfully exported and uploaded choice votes for question ${workPackage.questionId}`);
    }
    catch (error) {
        console.error("Error exporting choice votes:", error);
        await setJobError(workPackage.jobId, "Error exporting choice votes");
        done(error);
    }
}
