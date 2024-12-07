-- AlterTable
ALTER TABLE `tarefa` ADD COLUMN `prioridade` ENUM('baixa', 'media', 'alta') NOT NULL DEFAULT 'baixa';
