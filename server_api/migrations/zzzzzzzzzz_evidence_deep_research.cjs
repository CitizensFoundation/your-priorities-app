"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      await queryInterface.createTable(
        "evidence_research_runs",
        {
          id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
          bundle_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: { model: "evidence_bundles", key: "id" },
            onDelete: "CASCADE",
          },
          group_id: {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: { model: "groups", key: "id" },
            onDelete: "CASCADE",
          },
          status: {
            type: Sequelize.STRING(64),
            allowNull: false,
            defaultValue: "queued",
          },
          phase: {
            type: Sequelize.STRING(64),
            allowNull: false,
            defaultValue: "queued",
          },
          config: { type: Sequelize.JSONB, allowNull: false, defaultValue: {} },
          metrics: { type: Sequelize.JSONB, allowNull: false, defaultValue: {} },
          started_at: { type: Sequelize.DATE, allowNull: true },
          finished_at: { type: Sequelize.DATE, allowNull: true },
          requested_by_user_id: {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: { model: "users", key: "id" },
            onDelete: "SET NULL",
          },
          metadata: { type: Sequelize.JSONB, allowNull: false, defaultValue: {} },
          created_at: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.literal("NOW()"),
          },
          updated_at: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.literal("NOW()"),
          },
        },
        { transaction }
      );

      await queryInterface.createTable(
        "evidence_research_queries",
        {
          id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
          run_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: { model: "evidence_research_runs", key: "id" },
            onDelete: "CASCADE",
          },
          query: { type: Sequelize.TEXT, allowNull: false },
          evidence_type: {
            type: Sequelize.STRING(64),
            allowNull: false,
            defaultValue: "general",
          },
          generation: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0,
          },
          priority: {
            type: Sequelize.FLOAT,
            allowNull: false,
            defaultValue: 0.5,
          },
          status: {
            type: Sequelize.STRING(64),
            allowNull: false,
            defaultValue: "queued",
          },
          result_count: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0,
          },
          metadata: { type: Sequelize.JSONB, allowNull: false, defaultValue: {} },
          created_at: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.literal("NOW()"),
          },
          updated_at: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.literal("NOW()"),
          },
        },
        { transaction }
      );

      await queryInterface.createTable(
        "evidence_research_candidates",
        {
          id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
          run_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: { model: "evidence_research_runs", key: "id" },
            onDelete: "CASCADE",
          },
          source_id: {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: { model: "evidence_sources", key: "id" },
            onDelete: "SET NULL",
          },
          snapshot_id: {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: { model: "evidence_snapshots", key: "id" },
            onDelete: "SET NULL",
          },
          url: { type: Sequelize.TEXT, allowNull: false },
          url_hash: { type: Sequelize.STRING(128), allowNull: false },
          title: { type: Sequelize.TEXT, allowNull: true },
          query: { type: Sequelize.TEXT, allowNull: true },
          evidence_type: {
            type: Sequelize.STRING(64),
            allowNull: false,
            defaultValue: "general",
          },
          stage: {
            type: Sequelize.STRING(64),
            allowNull: false,
            defaultValue: "searched",
          },
          summary: { type: Sequelize.TEXT, allowNull: true },
          extracted_claims: {
            type: Sequelize.JSONB,
            allowNull: false,
            defaultValue: [],
          },
          score_relevance: {
            type: Sequelize.FLOAT,
            allowNull: false,
            defaultValue: 0,
          },
          score_quality: {
            type: Sequelize.FLOAT,
            allowNull: false,
            defaultValue: 0,
          },
          score_confidence: {
            type: Sequelize.FLOAT,
            allowNull: false,
            defaultValue: 0,
          },
          score_freshness: {
            type: Sequelize.FLOAT,
            allowNull: false,
            defaultValue: 0,
          },
          score_diversity: {
            type: Sequelize.FLOAT,
            allowNull: false,
            defaultValue: 0,
          },
          composite_score: {
            type: Sequelize.FLOAT,
            allowNull: false,
            defaultValue: 0,
          },
          elo_rating: {
            type: Sequelize.FLOAT,
            allowNull: false,
            defaultValue: 1000,
          },
          pairwise_wins: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0,
          },
          pairwise_losses: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0,
          },
          selected: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
          },
          generation: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0,
          },
          parent_candidate_ids: {
            type: Sequelize.JSONB,
            allowNull: false,
            defaultValue: [],
          },
          mutation_kind: { type: Sequelize.STRING(64), allowNull: true },
          metadata: { type: Sequelize.JSONB, allowNull: false, defaultValue: {} },
          created_at: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.literal("NOW()"),
          },
          updated_at: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.literal("NOW()"),
          },
        },
        { transaction }
      );

      await queryInterface.createTable(
        "evidence_research_comparisons",
        {
          id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
          run_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: { model: "evidence_research_runs", key: "id" },
            onDelete: "CASCADE",
          },
          candidate_a_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: { model: "evidence_research_candidates", key: "id" },
            onDelete: "CASCADE",
          },
          candidate_b_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: { model: "evidence_research_candidates", key: "id" },
            onDelete: "CASCADE",
          },
          winner_candidate_id: {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: { model: "evidence_research_candidates", key: "id" },
            onDelete: "SET NULL",
          },
          rationale: { type: Sequelize.TEXT, allowNull: true },
          metadata: { type: Sequelize.JSONB, allowNull: false, defaultValue: {} },
          created_at: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.literal("NOW()"),
          },
          updated_at: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.literal("NOW()"),
          },
        },
        { transaction }
      );

      await queryInterface.addIndex("evidence_research_runs", ["bundle_id"], {
        transaction,
      });
      await queryInterface.addIndex(
        "evidence_research_runs",
        ["group_id", "status"],
        { transaction }
      );
      await queryInterface.addIndex("evidence_research_queries", ["run_id"], {
        transaction,
      });
      await queryInterface.addIndex(
        "evidence_research_queries",
        ["run_id", "query", "evidence_type", "generation"],
        { unique: true, transaction }
      );
      await queryInterface.addIndex(
        "evidence_research_candidates",
        ["run_id", "url_hash", "evidence_type"],
        { unique: true, transaction }
      );
      await queryInterface.addIndex(
        "evidence_research_candidates",
        ["run_id", "selected"],
        { transaction }
      );
      await queryInterface.addIndex(
        "evidence_research_candidates",
        ["run_id", "elo_rating"],
        { transaction }
      );
      await queryInterface.addIndex(
        "evidence_research_comparisons",
        ["run_id"],
        { transaction }
      );

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  down: async (queryInterface) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      await queryInterface.dropTable("evidence_research_comparisons", {
        transaction,
      });
      await queryInterface.dropTable("evidence_research_candidates", {
        transaction,
      });
      await queryInterface.dropTable("evidence_research_queries", {
        transaction,
      });
      await queryInterface.dropTable("evidence_research_runs", {
        transaction,
      });
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
};
