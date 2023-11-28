import { ApiService } from "@/services/api";
import { Config, ConfigService } from "@/services/config";
import "dotenv/config";

class CommunitiesLogic {
  private apiService = new ApiService(process.env.COMMUNITY_CONFIG_URL ?? "");
  private configService = new ConfigService(this.apiService);

  async fetchCommunities(): Promise<Config[]> {
    try {
      return await this.configService.get();
    } catch (_) {}

    return [];
  }
}

const communitiesLogic = new CommunitiesLogic();

export default communitiesLogic;
