import { councilSessions, factions, committees, tags } from "./data";
import { createAdminClient, clearAllData } from "../shared/helper";

async function seedDatabase() {
  const supabase = createAdminClient();
  console.log("🌱 Starting database seeding...");

  try {
    await clearAllData(supabase);

    // Insert tags
    console.log("🏷️  Inserting tags...");
    const { data: insertedTags, error: tagsError } = await supabase
      .from("tags")
      .insert(tags)
      .select("id, label");

    if (tagsError) {
      throw new Error(`Failed to insert tags: ${tagsError.message}`);
    }

    console.log(`✅ Inserted ${insertedTags?.length ?? 0} tags`);

    // Insert council sessions
    console.log("🏛️  Inserting council sessions...");
    const { data: insertedSessions, error: sessionsError } = await supabase
      .from("council_sessions")
      .insert(councilSessions)
      .select("id, name");

    if (sessionsError) {
      throw new Error(
        `Failed to insert council sessions: ${sessionsError.message}`
      );
    }

    console.log(`✅ Inserted ${insertedSessions?.length ?? 0} council sessions`);

    // Insert committees
    console.log("🏢 Inserting committees...");
    const { data: insertedCommittees, error: committeesError } = await supabase
      .from("committees")
      .insert(committees)
      .select("id, name");

    if (committeesError) {
      throw new Error(
        `Failed to insert committees: ${committeesError.message}`
      );
    }

    console.log(`✅ Inserted ${insertedCommittees?.length ?? 0} committees`);

    // Insert factions
    console.log("🏛️  Inserting factions...");
    const { data: insertedFactions, error: factionsError } = await supabase
      .from("factions")
      .insert(factions)
      .select("id, name");

    if (factionsError) {
      throw new Error(`Failed to insert factions: ${factionsError.message}`);
    }

    console.log(`✅ Inserted ${insertedFactions?.length ?? 0} factions`);

    console.log("\n🎉 Database seeding completed successfully!");
    console.log("\n📊 Summary:");
    console.log(`  Tags:             ${insertedTags?.length ?? 0}`);
    console.log(`  Council Sessions: ${insertedSessions?.length ?? 0}`);
    console.log(`  Committees:       ${insertedCommittees?.length ?? 0}`);
    console.log(`  Factions:         ${insertedFactions?.length ?? 0}`);
    console.log("\n📝 Bills will be imported separately via the data import scripts.");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

seedDatabase();
