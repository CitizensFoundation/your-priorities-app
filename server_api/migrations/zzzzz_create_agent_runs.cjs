"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Create the 'agent_product_bundles' table
    await queryInterface.createTable("agent_product_bundles", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      uuid: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      configuration: {
        type: Sequelize.JSONB,
        allowNull: true,
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
    });

    await queryInterface.addIndex("agent_product_bundles", ["uuid"], {
      unique: true,
    });

    await queryInterface.addIndex("agent_product_bundles", ["name"]);



    // Create the 'agent_products' table
    await queryInterface.createTable("agent_products", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      uuid: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "users", // Assuming 'users' table exists
          key: "id",
        },
        onDelete: "CASCADE",
      },
      group_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "groups",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      domain_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "domains",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      configuration: {
        type: Sequelize.JSONB,
        allowNull: false
      },
      status: {
        type: Sequelize.JSONB,
        allowNull: true,
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
    });

    await queryInterface.addIndex("agent_products", ["uuid"], {
      unique: true,
    });
    await queryInterface.addIndex("agent_products", ["user_id"]);
    await queryInterface.addIndex("agent_products", ["group_id"]);
    await queryInterface.addIndex("agent_products", ["domain_id"]);

    // Create the 'subscription_plans' table
    await queryInterface.createTable("subscription_plans", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      uuid: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
      },
      agent_product_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "agent_products",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      name: {
        type: Sequelize.STRING(256),
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      configuration: {
        type: Sequelize.JSONB,
        allowNull: false,
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
    });

    await queryInterface.addIndex("subscription_plans", ["uuid"], {
      unique: true,
    });
    await queryInterface.addIndex("subscription_plans", ["agent_product_id"]);

    await queryInterface.addIndex("subscription_plans", ["name"]);


    // Create the 'subscriptions' table
    await queryInterface.createTable("subscriptions", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      uuid: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      domain_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "domains",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      agent_product_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "agent_products",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      configuration: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      subscription_plan_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "subscription_plans",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      start_date: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("NOW()"),
      },
      end_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      next_billing_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM("active", "paused", "cancelled", "expired"),
        allowNull: false,
        defaultValue: "active",
      },
      payment_method: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      transaction_id: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      metadata: {
        type: Sequelize.JSONB,
        allowNull: true,
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
    });

    await queryInterface.addIndex("subscriptions", ["uuid"], {
      unique: true,
    });
    await queryInterface.addIndex("subscriptions", ["user_id"]);
    await queryInterface.addIndex("subscriptions", ["agent_product_id"]);
    await queryInterface.addIndex("subscriptions", ["subscription_plan_id"]);

    // Create the 'discounts' table
    await queryInterface.createTable("discounts", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      uuid: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
      },
      code: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      discount_type: {
        type: Sequelize.ENUM("percentage", "fixed"),
        allowNull: false,
      },
      discount_value: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      max_uses: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      uses: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      start_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      end_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      applicable_to: {
        type: Sequelize.ENUM(
          "agent_product",
          "booster",
          "subscription",
          "both"
        ),
        allowNull: false,
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
    });

    await queryInterface.addIndex("discounts", ["uuid"], {
      unique: true,
    });
    await queryInterface.addIndex("discounts", ["code"], {
      unique: true,
    });


    // Create the 'agent_product_booster_purchases' table
    await queryInterface.createTable("agent_product_booster_purchases", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      uuid: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "users", // Assuming 'users' table exists
          key: "id",
        },
        onDelete: "CASCADE",
      },
      agent_product_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "agent_products",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      subscription_plan_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "subscription_plans",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      runs_purchased: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      currency: {
        type: Sequelize.STRING(10),
        allowNull: false,
        defaultValue: "USD",
      },
      purchase_date: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("NOW()"),
      },
      payment_method: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      status: {
        type: Sequelize.STRING(20),
        allowNull: false,
        defaultValue: "completed",
      },
      transaction_id: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      metadata: {
        type: Sequelize.JSONB,
        allowNull: true,
        defaultValue: {},
      },
      discount_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "discounts",
          key: "id",
        },
        onDelete: "SET NULL",
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
    });

    await queryInterface.addIndex("agent_product_booster_purchases", ["uuid"], {
      unique: true,
    });
    await queryInterface.addIndex("agent_product_booster_purchases", [
      "user_id",
    ]);
    await queryInterface.addIndex("agent_product_booster_purchases", [
      "agent_product_id",
    ]);
    await queryInterface.addIndex("agent_product_booster_purchases", [
      "subscription_plan_id",
    ]);
    await queryInterface.addIndex("agent_product_booster_purchases", [
      "discount_id",
    ]);


    // Create the 'agent_product_runs' table
    await queryInterface.createTable("agent_product_runs", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      uuid: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
      },
      subscription_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "subscriptions",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      start_time: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("NOW()"),
      },
      end_time: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      duration: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM(
          "pending",
          "running",
          "completed",
          "failed",
          "cancelled"
        ),
        allowNull: false,
        defaultValue: "pending",
      },
      workflow: {
        type: Sequelize.JSONB,
        allowNull: false
      },
      input_data: {
        type: Sequelize.JSONB,
        allowNull: true,
        defaultValue: {},
      },
      output_data: {
        type: Sequelize.JSONB,
        allowNull: true,
        defaultValue: {},
      },
      error_message: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      run_type: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      metadata: {
        type: Sequelize.JSONB,
        allowNull: true,
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
    });

    await queryInterface.addIndex("agent_product_runs", ["uuid"], {
      unique: true,
    });
    await queryInterface.addIndex("agent_product_runs", ["subscription_id"]);
    await queryInterface.addIndex("agent_product_runs", ["status"]);

    await queryInterface.createTable("subscription_discounts", {
      subscription_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "subscriptions",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      discount_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "discounts",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });

    // Add composite primary key
    await queryInterface.addConstraint("subscription_discounts", {
      fields: ["subscription_id", "discount_id"],
      type: "primary key",
      name: "subscription_discounts_pkey",
    });

    await queryInterface.addIndex("subscription_discounts", [
      "subscription_id",
    ]);
    await queryInterface.addIndex("subscription_discounts", ["discount_id"]);

    // Create the join table for agent_products and agent_product_bundles
    await queryInterface.createTable("agent_product_bundles_products", {
      agent_product_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "agent_products",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      agent_product_bundle_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "agent_product_bundles",
          key: "id",
        },
        onDelete: "CASCADE",
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
    });

    // Add composite primary key
    await queryInterface.addConstraint("agent_product_bundles_products", {
      fields: ["agent_product_id", "agent_product_bundle_id"],
      type: "primary key",
      name: "agent_product_bundles_products_pkey",
    });

    // Add indexes for better query performance
    await queryInterface.addIndex("agent_product_bundles_products", ["agent_product_id"]);
    await queryInterface.addIndex("agent_product_bundles_products", ["agent_product_bundle_id"]);
  },

  down: async (queryInterface, Sequelize) => {},
};
