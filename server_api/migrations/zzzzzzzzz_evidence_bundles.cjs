"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      await queryInterface.createTable(
        "evidence_sources",
        {
          id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
          canonical_url: { type: Sequelize.TEXT, allowNull: false },
          source_type: {
            type: Sequelize.STRING(64),
            allowNull: false,
            defaultValue: "web_page",
          },
          publisher: { type: Sequelize.STRING(256), allowNull: true },
          title: { type: Sequelize.TEXT, allowNull: true },
          license: { type: Sequelize.STRING(256), allowNull: true },
          trust_tier: {
            type: Sequelize.STRING(64),
            allowNull: false,
            defaultValue: "standard",
          },
          language: { type: Sequelize.STRING(16), allowNull: true },
          freshness_policy: {
            type: Sequelize.STRING(64),
            allowNull: false,
            defaultValue: "monthly",
          },
          last_checked_at: { type: Sequelize.DATE, allowNull: true },
          last_modified_on_server: { type: Sequelize.TEXT, allowNull: true },
          content_hash: { type: Sequelize.STRING(128), allowNull: true },
          image_url: { type: Sequelize.TEXT, allowNull: true },
          current_snapshot_id: { type: Sequelize.INTEGER, allowNull: true },
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
        "evidence_snapshots",
        {
          id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
          source_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: { model: "evidence_sources", key: "id" },
            onDelete: "CASCADE",
          },
          snapshot_hash: { type: Sequelize.STRING(128), allowNull: false },
          fetched_at: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.literal("NOW()"),
          },
          fetch_method: {
            type: Sequelize.STRING(64),
            allowNull: false,
            defaultValue: "fetch",
          },
          status: {
            type: Sequelize.STRING(64),
            allowNull: false,
            defaultValue: "ok",
          },
          error_message: { type: Sequelize.TEXT, allowNull: true },
          raw_html: { type: Sequelize.TEXT, allowNull: true },
          markdown: { type: Sequelize.TEXT, allowNull: true },
          extracted_text: { type: Sequelize.TEXT, allowNull: true },
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

      await queryInterface.addConstraint("evidence_sources", {
        fields: ["current_snapshot_id"],
        type: "foreign key",
        name: "evidence_sources_current_snapshot_fk",
        references: { table: "evidence_snapshots", field: "id" },
        onDelete: "SET NULL",
        transaction,
      });

      await queryInterface.createTable(
        "evidence_bundles",
        {
          id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
          uuid: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            allowNull: false,
          },
          subject_type: { type: Sequelize.STRING(32), allowNull: false },
          subject_id: { type: Sequelize.INTEGER, allowNull: false },
          group_id: {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: { model: "groups", key: "id" },
            onDelete: "CASCADE",
          },
          post_id: {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: { model: "posts", key: "id" },
            onDelete: "CASCADE",
          },
          point_id: {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: { model: "points", key: "id" },
            onDelete: "CASCADE",
          },
          question_or_claim: { type: Sequelize.TEXT, allowNull: false },
          short_analysis: { type: Sequelize.TEXT, allowNull: true },
          key_findings: { type: Sequelize.JSONB, allowNull: false, defaultValue: [] },
          uncertainties: { type: Sequelize.JSONB, allowNull: false, defaultValue: [] },
          missing_data: { type: Sequelize.JSONB, allowNull: false, defaultValue: [] },
          source_highlights: {
            type: Sequelize.JSONB,
            allowNull: false,
            defaultValue: [],
          },
          connected_debate: {
            type: Sequelize.JSONB,
            allowNull: false,
            defaultValue: [],
          },
          status: {
            type: Sequelize.STRING(64),
            allowNull: false,
            defaultValue: "queued",
          },
          language: { type: Sequelize.STRING(16), allowNull: true },
          agent_product_run_id: { type: Sequelize.INTEGER, allowNull: true },
          reviewed_by_user_id: {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: { model: "users", key: "id" },
            onDelete: "SET NULL",
          },
          published_at: { type: Sequelize.DATE, allowNull: true },
          expires_at: { type: Sequelize.DATE, allowNull: true },
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
        "evidence_bundle_sources",
        {
          id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
          bundle_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: { model: "evidence_bundles", key: "id" },
            onDelete: "CASCADE",
          },
          source_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: { model: "evidence_sources", key: "id" },
            onDelete: "CASCADE",
          },
          snapshot_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: { model: "evidence_snapshots", key: "id" },
            onDelete: "CASCADE",
          },
          relevance_score: {
            type: Sequelize.FLOAT,
            allowNull: false,
            defaultValue: 0,
          },
          citation_label: { type: Sequelize.STRING(64), allowNull: false },
          quoted_ranges: {
            type: Sequelize.JSONB,
            allowNull: false,
            defaultValue: [],
          },
          source_role: {
            type: Sequelize.STRING(64),
            allowNull: false,
            defaultValue: "context",
          },
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
        "evidence_claims",
        {
          id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
          bundle_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: { model: "evidence_bundles", key: "id" },
            onDelete: "CASCADE",
          },
          claim_text: { type: Sequelize.TEXT, allowNull: false },
          stance: {
            type: Sequelize.STRING(64),
            allowNull: false,
            defaultValue: "contextualizes",
          },
          confidence: {
            type: Sequelize.FLOAT,
            allowNull: false,
            defaultValue: 0.5,
          },
          source_refs: { type: Sequelize.JSONB, allowNull: false, defaultValue: [] },
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
        "evidence_portal_analyses",
        {
          id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
          group_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: { model: "groups", key: "id" },
            onDelete: "CASCADE",
          },
          title: { type: Sequelize.TEXT, allowNull: true },
          short_analysis: { type: Sequelize.TEXT, allowNull: true },
          theme_summaries: {
            type: Sequelize.JSONB,
            allowNull: false,
            defaultValue: [],
          },
          source_refs: { type: Sequelize.JSONB, allowNull: false, defaultValue: [] },
          bundle_refs: { type: Sequelize.JSONB, allowNull: false, defaultValue: [] },
          connected_debate: {
            type: Sequelize.JSONB,
            allowNull: false,
            defaultValue: [],
          },
          status: {
            type: Sequelize.STRING(64),
            allowNull: false,
            defaultValue: "draft",
          },
          language: { type: Sequelize.STRING(16), allowNull: true },
          model_metadata: {
            type: Sequelize.JSONB,
            allowNull: false,
            defaultValue: {},
          },
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

      await queryInterface.addIndex("evidence_sources", ["canonical_url"], {
        unique: true,
        transaction,
      });
      await queryInterface.addIndex("evidence_sources", ["source_type"], {
        transaction,
      });
      await queryInterface.addIndex("evidence_snapshots", ["source_id"], {
        transaction,
      });
      await queryInterface.addIndex(
        "evidence_snapshots",
        ["source_id", "snapshot_hash"],
        { unique: true, transaction }
      );
      await queryInterface.addIndex("evidence_bundles", ["uuid"], {
        unique: true,
        transaction,
      });
      await queryInterface.addIndex(
        "evidence_bundles",
        ["subject_type", "subject_id", "status"],
        { transaction }
      );
      await queryInterface.addIndex("evidence_bundles", ["group_id", "status"], {
        transaction,
      });
      await queryInterface.addIndex("evidence_bundle_sources", ["bundle_id"], {
        transaction,
      });
      await queryInterface.addIndex(
        "evidence_bundle_sources",
        ["bundle_id", "snapshot_id"],
        { unique: true, transaction }
      );
      await queryInterface.addIndex("evidence_claims", ["bundle_id"], {
        transaction,
      });
      await queryInterface.addIndex(
        "evidence_portal_analyses",
        ["group_id", "status"],
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
      await queryInterface.dropTable("evidence_portal_analyses", {
        transaction,
      });
      await queryInterface.dropTable("evidence_claims", { transaction });
      await queryInterface.dropTable("evidence_bundle_sources", {
        transaction,
      });
      await queryInterface.dropTable("evidence_bundles", { transaction });
      await queryInterface.removeConstraint(
        "evidence_sources",
        "evidence_sources_current_snapshot_fk",
        { transaction }
      );
      await queryInterface.dropTable("evidence_snapshots", { transaction });
      await queryInterface.dropTable("evidence_sources", { transaction });
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
};
