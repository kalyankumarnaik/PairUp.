import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  IsUrl,
  Max,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';

export class AddPhotoDto {
  @ApiProperty({ example: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb' })
  @IsUrl()
  @IsNotEmpty()
  url: string;

  @ApiPropertyOptional({ example: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200' })
  @IsOptional()
  @IsUrl()
  thumbnailUrl?: string;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  isPrimary?: boolean;
}

export class PhotoOrderItemDto {
  @ApiProperty({ example: '3fa85f64-5717-4562-b3fc-2c963f66afa6' })
  @IsUUID()
  photoId: string;

  @ApiProperty({ example: 0, minimum: 0, maximum: 5 })
  @IsInt()
  @Min(0)
  @Max(5)
  displayOrder: number;
}

export class ReorderPhotosDto {
  @ApiProperty({ type: [PhotoOrderItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PhotoOrderItemDto)
  orders: PhotoOrderItemDto[];
}

export class ProfilePromptItemDto {
  @ApiProperty({ example: 'Together we could...' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  promptQuestion: string;

  @ApiProperty({ example: 'Plan our next road trip along Highway 1 and debate the best playlists.' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  promptAnswer: string;
}

export class SetPromptsDto {
  @ApiProperty({ type: [ProfilePromptItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProfilePromptItemDto)
  prompts: ProfilePromptItemDto[];
}

export class SetInterestsDto {
  @ApiProperty({
    example: ['Photography', 'Coffee & Cafes', 'Hiking & Outdoors'],
    description: 'Array of exact interest names or UUIDs',
  })
  @IsArray()
  @IsString({ each: true })
  interestNames: string[];
}
